import apiProxy from "../api/apiProxy";

var moment = require("moment");

export async function getLeankitCards(leankitAPIHost, boardId, lane_class_types) {
    // Load the data from the API (notice we're using the await keyword from the async framework)

    // For the API call, start at offset of 0 (beginning of cards).
    let offset = 0;
    // Try to get 1000 cards, though currently (2019), limit is 500 cards set by Leankit.  So, we'll get 500 cards, then increase our offset by that amount
    let limit = 1000;

    // For lane_class_types (function param), there are three values. You can pass multiple, separate by commas like 'lane_class_types=active,archive'
    //    'active' is the cards not in the backlog, and not in the Finished lane
    //    'backlog' is the cards in the backlog
    //    'archive' is everything in the Finished lane (whether or not its actually been archived yet)

    let response_cards_promise = apiProxy.get(
        // NOTE: if you modify this API path, there's a second looping call down below
        `/leankit-api/${leankitAPIHost}/io/card?board=${boardId}&limit=${limit}&offset=${offset}&lane_class_types=${lane_class_types}`
    );
    let response_lanes_promise = apiProxy.get(`/leankit-api/${leankitAPIHost}/io/board/${boardId}`);

    // Wait for both promises to finish
    let [response_cards, response_lanes] = [await response_cards_promise, await response_lanes_promise];

    // Save a copy of this first batch of cards
    let leankitCards = response_cards.data.cards;

    // If the last card we got was less then the total number of cards, must mean there are more cards to get, start looping
    if (response_cards.data.pageMeta.endRow < response_cards.data.pageMeta.totalRecords) {
        // Set the offset equal to how many cards we got in the first call
        offset = response_cards.data.pageMeta.endRow;
        do {
            console.log(`Need to get more Leankit data, offset now ${offset}`);
            response_cards = await apiProxy.get(
                `/leankit-api/${leankitAPIHost}/io/card?board=${boardId}&limit=${limit}&offset=${offset}&lane_class_types=${lane_class_types}`
            );
            // Concatenate the new cards with the cards we've already got
            leankitCards = leankitCards.concat(response_cards.data.cards);
            // Set the offset to be equal to the last card we got, and then check to see if we still need to get more cards
            offset = response_cards.data.pageMeta.endRow;
        } while (response_cards.data.pageMeta.endRow < response_cards.data.pageMeta.totalRecords);
    }

    // OK, by this point, we've got all the cards which match our query
    // Now we need to do some magic.  You see, each card only knows about his immediate parent lane
    // I want each card to know about *all* their parent lanes

    // Setup dummy entries for custom fields (u_lanes)
    leankitCards = leankitCards.map(card => {
        card.u_lanes = [{}, {}, {}];
        return card;
    });

    // Create an object of all lanes, indexed by lane Id
    let lanesById = {};
    response_lanes.data.lanes.forEach(lane => {
        lanesById[lane.id] = lane;
    });

    // Insert lane info into each card (u_lanes because its a custom field)
    leankitCards.forEach(card => {
        // // Push the card's own lane
        // card.u_lanes[0] = lanesById[card.lane.id];
        // // Push the first parent
        // card.u_lanes[1] = lanesById[lanesById[card.u_lanes[0].id].parentLaneId];
        // // push the second parent
        // card.u_lanes[2] = lanesById[card.u_lanes[1].parentLaneId];

        let parentLane = lanesById[card.lane.id];
        let u_lanes = [];
        while (parentLane !== undefined) {
            // Add the name of the parent lane to the *front* of the array, so top-most lane will end up first
            u_lanes.unshift(parentLane);
            // Set parent lane (go up on level) for the next loop
            parentLane = lanesById[parentLane.parentLaneId];
        }
        // Attach lane structure to cards
        card.u_lanes = u_lanes;
    });

    // Compute daysInLane for each card
    leankitCards.forEach(card => {
        card.daysInLane = moment().diff(moment(card.movedOn), "days");
    });

    return leankitCards;
}
