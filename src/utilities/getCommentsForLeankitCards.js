import apiProxy from "../api/apiProxy";

export async function getCommentsforLeankitCards(leankitCards, leankitAPIHost) {
    // Load the data from the API (notice we're using the await keyword from the async framework)

    let startDate = new Date();
    let promises = leankitCards.map(async function(card) {
        // console.log(card.id);
        let response = await apiProxy.get(`/leankit-api/${leankitAPIHost}/io/card/${card.id}/comment`);
        card.comments = response.data.comments;
        // console.log(response.data.comments.length);
    });

    // console.log("modified cards", leankitCards);

    await Promise.all(promises);

    let endDate = new Date();
    console.log("Duration: ", endDate - startDate);
    return leankitCards;
}
