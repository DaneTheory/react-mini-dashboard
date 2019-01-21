import apiProxy from "../api/apiProxy";

export async function getBacklogDurationForLeankitCards(leankitCards, leankitAPIHost) {
    // Load the data from the API (notice we're using the await keyword from the async framework)

    let startDate = new Date();
    let promises = leankitCards.map(async function(card) {
        // console.log(card.id);
        let response = await apiProxy.get(`/leankit-api/${leankitAPIHost}/Api/Card/History/412731036/${card.id}`);
        card.history = response.data.ReplyData[0];
    });

    await Promise.all(promises);

    leankitCards.forEach(card => {
        // console.log("card's entire history", card.history);
        let movedFromBacklogArray = card.history.filter(historyEvent => {
            return (
                historyEvent.Type === "CardMoveEventDTO" &&
                historyEvent.FromLaneTitle.includes("Backlog:") &&
                !historyEvent.ToLaneTitle.includes("Backlog:")
            );
        });
        // console.log("MovedFromBacklogArray", movedFromBacklogArray);
        console.log((movedFromBacklogArray.length > 0 && movedFromBacklogArray[0].EventDateTime) || undefined);
        card.backlogComplete = (movedFromBacklogArray.length > 0 && movedFromBacklogArray[0].EventDateTime) || undefined;
    });

    let endDate = new Date();
    console.log("Get History Duration: ", endDate - startDate);
    return leankitCards;
}
