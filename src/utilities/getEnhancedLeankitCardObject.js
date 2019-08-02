// Imports
import { sprintf } from "sprintf-js";
import apiProxy from "../api/apiProxy";

// Have to be after the imports ?
var moment = require("moment");

// Changes that need to be made
// Size = size
// Type = type.name = card["type"]["title"]
// card["Lane2"] = card.u_lanes[1].name
// card["Tags"] = card["tags"]
// card["lastMoveDay"]  -->  movedOn: "2019-01-31T14:17:55Z"
// card["created"]  --> card["createdOn"]        createdOn: "2018-12-17T20:59:32Z"

function isWorkingDay(date) {
    // List of known holidays
    var holidayList = ["1/1/2019", "7/4/2019", "7/5/2019", "9/2/2019", "11/28/2019", "11/29/2019", "12/25/2019", "12/31/2019", "1/1/2020"];

    let currentYear = new Date().getFullYear();
    date = date + "/" + currentYear;
    var dayOfWeekNum = new Date(date).getDay();
    // Define type of each day starting with Sunday
    var dayType = ["Weekend", "WeekDay", "WeekDay", "WeekDay", "WeekDay", "WeekDay", "Weekend"][dayOfWeekNum];

    // Check to see if this is a known holiday
    if (holidayList.includes(date)) {
        // This is a holiday, so therefore, not a workingDay
        return false;
    } else {
        // If it's a weekday, then workingDay is true, else it's a weekend, and therefore not a workingDay
        return dayType === "WeekDay";
    }
}

// --------------------------------------------------------------
// ------------------- Common to both Demand and Sprint ---------
// --------------------------------------------------------------
// private helper function
function addURLtoCards(listCards) {
    // Enrich each card by adding URL field (BoardID is hard-coded)
    for (let i = 0; i < listCards.length; i++) {
        let card = listCards[i];
        // card.u_url = sprintf("%s/%s/%s", "https://jnj.leankit.com/Boards/View", boardID, card["Id"]);
        let leankit_instance = "jnj.leankit.com";
        card.u_url = `https://${leankit_instance}/card/${card.id}`;
    }
}
// --------------------------------------------------------------
// private helper function
function addParentLanestoCards(listCards, response_lanes) {
    // Now we need to do some magic.  You see, each card only knows about his immediate parent lane
    // I want each card to know about *all* their parent lanes

    // Setup dummy entries for custom fields (u_lanes)
    listCards = listCards.map(card => {
        card.u_lanes = [{}, {}, {}];
        return card;
    });

    // Create an object of all lanes, indexed by lane Id
    let lanesById = {};
    response_lanes.data.lanes.forEach(lane => {
        lanesById[lane.id] = lane;
    });

    // Insert lane info into each card (u_lanes because its a custom field)
    listCards.forEach(card => {
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
}
// --------------------------------------------------------------
// private helper function
function addDaysInLanetoCards(listCards) {
    // Compute daysInLane for each card
    for (let i = 0; i < listCards.length; i++) {
        let card = listCards[i];
        card.u_daysInLane = moment().diff(moment(card.movedOn), "days");
    }
}
// --------------------------------------------------------------
// private helper function
function addDaysSinceCreationtoCards(listCards) {
    for (let i = 0; i < listCards.length; i++) {
        let card = listCards[i];
        card.u_daysSinceCreation = moment().diff(card.createdOn, "days");
    }
}
// --------------------------------------------------------------
// private helper function
function addDaysSinceUpdatetoCards(listCards) {
    for (let i = 0; i < listCards.length; i++) {
        let card = listCards[i];
        card.u_daysSinceUpdate = moment().diff(card.updatedOn, "days");
    }
}
// --------------------------------------------------------------
// private helper function
function addCardOwnertoCards(listCards) {
    for (let i = 0; i < listCards.length; i++) {
        let card = listCards[i];
        card.u_cardOwner = (card.assignedUsers && card.assignedUsers.length > 0 && card.assignedUsers[0].fullName) || "No Owner";
    }
}
// --------------------------------------------------------------
// private helper function
// NOTE: This is dependent on lane info, so be sure to call addParentLanestoCards first
function addCardTypetoCards(listCards) {
    for (let i = 0; i < listCards.length; i++) {
        let card = listCards[i];
        if (card.u_lanes[0].name.includes("Product Discovery")) {
            // Cards inside of "Product Discovery" lane default to "Enhancement"
            card.u_cardType = card.customIcon && card.customIcon.title === "Defect" ? "Defect" : "Enhancement";
        } else {
            // Cards outside of "Product Discovery" lane
            card.u_cardType = card.customIcon && card.customIcon.title === "Defect" ? "Defect" : "No Card Icon";
        }
    }
}
// --------------------------------------------------------------
// private helper function
// --------------------------------------------------------------
// private helper function
function addPointsToObject(givenObject, givenKey, points) {
    if (givenObject.hasOwnProperty(givenKey)) {
        givenObject[givenKey] = givenObject[givenKey] + points;
    } else {
        givenObject[givenKey] = points;
    }
}
// --------------------------------------------------------------
// private helper function
function getSprintInfo(listCards, verbose = false) {
    // Loop through cards, listing out the "Lane2" attribute of each card
    // this is the same as:    listCards.map(function(a) {return a.Lane2})
    // Create unique array of elements (first create set of unique elements, then convert set back to array)
    // var setLane2 = new Set(listCards.map(a => a.Lane2));
    var setLane2 = new Set(listCards.map(a => a.u_lanes[1].name));
    var listLane2 = Array.from(setLane2);

    // Keep only Lane names start with "Sprint", and contain "(" and ")"
    var results = listLane2.filter(function(v) {
        return /^Sprint.+\(.+\)/.test(v);
    });

    // Sort the sprint names, and get the first one, for example "Sprint 16 (6/7-6/20)"
    var currentSprintLane = results.sort()[0];
    if (verbose) console.log("Current Sprint Lane:", currentSprintLane);

    // Split the name into parts based on "(" and ")"
    var sprintLaneParts = currentSprintLane.split(/[()]/);
    // Get the 1st element, and remove whitespace at beginning and end (via trim)
    var sprintName = sprintLaneParts[0].trim();
    var sprintLaneStartEnd = sprintLaneParts[1];

    // create Date objects for start and end dates
    var yearString = new Date().getFullYear();
    if (verbose) console.log(`Sprint Lane Dates: ${sprintLaneStartEnd}`);
    var dateBeginStr = sprintf("%s/%s", sprintLaneStartEnd.split("-")[0], yearString);
    var dateEndStr = sprintf("%s/%s", sprintLaneStartEnd.split("-")[1], yearString);
    var startDate = new Date(dateBeginStr);
    var endDate = new Date(dateEndStr);
    if (verbose) console.log(`Sprint Lane Start: ${dateBeginStr}, Sprint Lane End: ${dateEndStr}`);

    // Look for a lane name containing "Done"
    var doneLane = listLane2.filter(function(v) {
        return /Done/.test(v);
    })[0];
    var doneLanes = ["In Review", doneLane];

    // Define all the Lanes where we can find cards from the current sprint
    var sprintLanes = [currentSprintLane, "In Review", doneLane];
    // Compute the delta (number of days between start and finish)
    var numDays = computeDays(startDate, endDate);

    return [listLane2, sprintName, currentSprintLane, sprintLanes, doneLanes, startDate, endDate, numDays];
}

// ------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
function createPlannedLine(listCards, theLabels, totalPlannedPoints, doneLanes) {
    // Burndown: Compute planned Points Remaining Per Day

    // Compute (accumulate) how many Planned points were completed for each day of current sprint
    var donePointsPerDay = {};
    for (let card of listCards) {
        if (cardIsDone(card, doneLanes) && card["type"]["title"] === "Planned") {
            // This is a done Planned card, accumulate the done Planned points for that day
            // var lastMoved = new Date(card["lastMoveDay"]);
            var lastMoved = new Date(card["movedOn"]);
            var lastMovedStr = lastMoved.getMonth() + 1 + "/" + lastMoved.getDate();
            addPointsToObject(donePointsPerDay, lastMovedStr, parseInt(card["size"]));
        }
    }

    // Compute Remaining Planned Points per Day (with associated color for datapoint)
    var PlannedPoints = totalPlannedPoints;
    var plannedPtsRemainingPerDay = [];
    // Loop through each day of the sprint
    for (let day of theLabels) {
        if (donePointsPerDay.hasOwnProperty(day)) {
            // Decrement PlannedPoints by the number of points that were done on this day
            PlannedPoints = PlannedPoints - donePointsPerDay[day];
        }
        plannedPtsRemainingPerDay.push(PlannedPoints);
    }

    return plannedPtsRemainingPerDay;
}
// ------------------------------------------------------------------------------------------------
function createTheoreticalBurnDownLine(theLabels, totalPlannedPoints, numDays) {
    // Burndown: Compute data points for Burndown line (needs totalPlannedPoints)
    var burndownStart = totalPlannedPoints;
    var burndownFinish = 0;
    var numWorkingDays = 0;

    // compute the total number of working days
    for (let i = 1; i < numDays; i++) {
        if (isWorkingDay(theLabels[i])) numWorkingDays += 1;
    }

    // compute how many points we need to accomplish every day so that theoretical burndown line reaches zero at sprint end
    var neededPointsPerDay = (burndownStart - burndownFinish) / (numWorkingDays - 0);

    // Compute data points for the burndown line
    var burndownLinePerDay = [burndownStart];
    var burndownCurrent = burndownStart;
    for (let i = 1; i < numDays; i++) {
        // burndownLinePerDay.push(burndownStart - (neededPointsPerDay * i));
        if (isWorkingDay(theLabels[i])) {
            burndownCurrent -= neededPointsPerDay;
        }
        burndownLinePerDay.push(Number(burndownCurrent.toFixed(1)));
        // console.log("isWorkingDay: " + theLabels[i] + "   workingDay: " + isWorkingDay(theLabels[i]));
    }
    burndownLinePerDay.push(burndownFinish);

    return burndownLinePerDay;
}
// ------------------------------------------------------------------------------------------------
function createUnplannedLine(listCards, theLabels, sprintLane, doneLanes) {
    // Burndown: compute Unplanned Points Remaining Per Day
    var unplannedPointsPerDay = {};
    for (var i = 0; i < listCards.length; i++) {
        var card = listCards[i];

        // Find Unplanned Cards
        if (card["type"]["title"] === "Unplanned") {
            let cardPoints = parseInt(card["size"]) || 0;
            // Unplanned Cards in the Sprint Lane (so accumulate points)
            if (card.u_lanes[1].name.includes(sprintLane)) {
                var lastMoved1 = new Date(card["movedOn"]);
                var lastMovedStr1 = lastMoved1.getMonth() + 1 + "/" + lastMoved1.getDate();
                addPointsToObject(unplannedPointsPerDay, lastMovedStr1, cardPoints);
            }
            // Unplanned Cards in the Done Lane (so accumulate on created day, and decrement points on lastMove day)
            if (cardIsDone(card, doneLanes)) {
                // Accumulate points on on the day created
                var createdDate = new Date(card["createdOn"]);
                var createdDateStr = createdDate.getMonth() + 1 + "/" + createdDate.getDate();
                addPointsToObject(unplannedPointsPerDay, createdDateStr, cardPoints);

                // Decrement points on last move day
                var lastMoved2 = new Date(card["movedOn"]);
                var lastMovedStr2 = lastMoved2.getMonth() + 1 + "/" + lastMoved2.getDate();
                // Subtract the points (by inverting the number of points associated with card)
                addPointsToObject(unplannedPointsPerDay, lastMovedStr2, 0 - cardPoints);
            }
        }
    }

    // Compute Remaining Points per Day (Unplanned)
    var unplannedPoints = 0;
    var unplannedPtsRemainingPerDay = [];
    for (var j = 0; j < theLabels.length; j++) {
        if (unplannedPointsPerDay.hasOwnProperty(theLabels[j])) {
            unplannedPoints = unplannedPoints + unplannedPointsPerDay[theLabels[j]];
        }
        unplannedPtsRemainingPerDay.push(unplannedPoints);
    }
    return unplannedPtsRemainingPerDay;
}

// ------------------------------------------------------------------------------------------------
// private helper function
function computeBurndownLines(listCards, theLabels) {
    // Parse cards, get lanes, and figure out the sprint start/finish dates
    // Returns an array of values, we only need some of them
    var [, , sprintLane, sprintLanes, doneLanes, , , numDays] = getSprintInfo(listCards);

    // Get total number of planned points
    // Returns an array of values, we only need some of them
    var [totalPlannedPoints] = getTotalPoints(listCards, sprintLanes);

    // Create burndown line for Planned Points
    var plannedPtsRemainingPerDay = createPlannedLine(listCards, theLabels, totalPlannedPoints, doneLanes);

    // Create burndown line for theoretical perfect
    var burndownLinePerDay = createTheoreticalBurnDownLine(theLabels, totalPlannedPoints, numDays);

    // Create burndown line for Unplanned Points
    var unplannedPtsRemainingPerDay = createUnplannedLine(listCards, theLabels, sprintLane, doneLanes);

    // Return all three lines to the caller
    return [plannedPtsRemainingPerDay, unplannedPtsRemainingPerDay, burndownLinePerDay];
}

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
// private helper function
function computeDays(startDate, endDate) {
    // Compute the delta (number of days between start and finish)
    var deltaMilliSec = Math.abs(endDate.getTime() - startDate.getTime());
    //var deltaDays = (Math.ceil(deltaMilliSec / (1000 * 3600 * 24))) + 2;
    var deltaDays = Math.ceil(deltaMilliSec / (1000 * 3600 * 24));
    return deltaDays;
}

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
// private helper function
function getChartLabels(startDate, deltaDays) {
    // Populate the list of Labels used for the chart
    var theDate = startDate;
    var theLabels = [];
    // Loop through all the "days"
    for (var i = 1; i < deltaDays + 1; i++) {
        // compute the date string for same
        var theDateStr = theDate.getMonth() + 1 + "/" + theDate.getDate();
        theLabels.push(theDateStr);
        // increment date & loop back around
        theDate.setDate(theDate.getDate() + 1);
    }
    return theLabels;
}

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
// private helper function
function getTotalPoints(listCards, sprintLanes) {
    // Compute total Planned Points (single number)
    var totalPlannedPoints = 0;
    var totalUnplannedPoints = 0;

    for (var i = 0; i < listCards.length; i++) {
        var card = listCards[i];
        // if (sprintLanes.includes(card["Lane2"])) {
        if (sprintLanes.includes(card["u_lanes"][1].name)) {
            // if (card["type"]["title"] == "Planned") {
            if (card["type"]["title"] === "Planned") {
                // This is a Planned Card
                totalPlannedPoints += parseInt(card["size"]);
            }
            // if (card["type"]["title"] == "Unplanned") {
            if (card["type"]["title"] === "Unplanned") {
                // This is a Planned Card
                totalUnplannedPoints += parseInt(card["size"]);
            }
        }
    }
    return [totalPlannedPoints, totalUnplannedPoints];
}

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
// private helper function
function cardIsDone(card, doneLanes) {
    return doneLanes.includes(card.u_lanes[1].name);
}
// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
// private helper function
function cardIsEpic(card) {
    return card["type"]["title"] === "Epic";
}
// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
// private helper function
function cardIsPlanned(card) {
    return card["type"]["title"] === "Planned";
}
// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
// private helper function
function cardIsEarlyWin(card) {
    return card["tags"].includes("Early Win");
}
// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
// private helper function
function cardIsBlocked(card) {
    return card["blockedStatus"].isBlocked;
}
// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
// private helper function
function cardInSprint(card, sprintLanes) {
    // sprintLanes is an array of lane names (which are considered part of sprint)
    // Checks to see if card's Level-2 Lane name is the same as one of the defined sprint lanes
    return sprintLanes.includes(card.u_lanes[1].name);
}

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
// private helper function
function getLeankitStats(listCards, sprintName, sprintLanes, totalPlannedPoints, doneLanes) {
    // Compute total number of Early Points (cards tagged with Early Win)
    var earlyPoints = 0;
    var cardCount = 0;
    var cardCountHasAC = 0;
    var donePointsPlanned = 0;
    var donePointsPlannedEarlyWin = 0;
    // compute total number of earlyWin points
    // compute number of cards with proper Acceptance Criteria
    for (var i = 0; i < listCards.length; i++) {
        var card = listCards[i];
        if (cardInSprint(card, sprintLanes) && !cardIsEpic(card)) {
            cardCount += 1;
            if (cardIsEarlyWin(card)) {
                earlyPoints += parseInt(card["size"]);
            }
            if (card["hasAcceptCriteria"] === true) cardCountHasAC += 1;
            if (cardIsPlanned(card) && cardIsDone(card, doneLanes)) {
                donePointsPlanned += parseInt(card["size"]);
                if (cardIsEarlyWin(card)) donePointsPlannedEarlyWin += parseInt(card["size"]);
            }
        }
    }

    var leankitStats = [];
    leankitStats.push({ name: "Sprint Name", stat: sprintName });
    leankitStats.push({ name: "Total Planned Points", stat: totalPlannedPoints });
    leankitStats.push({ name: "Early Win Points", stat: earlyPoints });
    var earlyPointPct = (earlyPoints / totalPlannedPoints) * 100;
    var earlyPointsString = earlyPointPct.toFixed(0);
    leankitStats.push({ name: "Early Win %", stat: earlyPointsString + "%" });
    leankitStats.push({ name: "# of Cards", stat: cardCount });
    leankitStats.push({ name: "Cards w/ AC", stat: cardCountHasAC });
    leankitStats.push({ name: "Planned Points (Done)", stat: donePointsPlanned });
    leankitStats.push({ name: "Early Win Points (Done)", stat: donePointsPlannedEarlyWin });
    leankitStats.push({ name: "Remaining Planned Points", stat: totalPlannedPoints - donePointsPlanned });
    var earlyPointPctDone = (donePointsPlannedEarlyWin / earlyPoints) * 100;
    var earlyPointsPctDoneString = earlyPointPctDone.toFixed(0);
    leankitStats.push({ name: "Early Win (% Done)", stat: earlyPointsPctDoneString + "%" });
    return leankitStats;
}

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
// private helper function
function getListPointsByOwner(listCards, sprintLane) {
    var objectCardOwners = {};
    for (var i = 0; i < listCards.length; i++) {
        var card = listCards[i];
        if (card["u_lanes"][1].name.includes(sprintLane) && card["type"]["title"] === "Planned") {
            // This is a Planned Card, not yet Done
            let ownerName = (card["assignedUsers"][0] && card["assignedUsers"][0]["fullName"]) || "Null";
            addPointsToObject(objectCardOwners, ownerName, parseInt(card["size"]));
        }
    }
    // Convert Object to Array of Objects (which gives more structure/names to the View)
    var listCardOwners = [];
    for (var key in objectCardOwners) {
        if (objectCardOwners.hasOwnProperty(key)) {
            listCardOwners.push({ owner: key, points: objectCardOwners[key] });
        }
    }
    return listCardOwners;
}

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
// private helper function
function getListCardsIsHuddle(listCards, sprintLanes) {
    // Cards Tagged Huddle
    var listCardsIsHuddle = [];
    for (var i = 0; i < listCards.length; i++) {
        var card = listCards[i];
        if (sprintLanes.includes(card.u_lanes[1].name) && card["tags"].includes("Huddle")) {
            // This is huddle card (tagged Huddle or Blocked)
            listCardsIsHuddle.push(card);
        }
    }
    return listCardsIsHuddle;
}

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
// private helper function
function getListCardsIsBlocked(listCards, sprintLanes, doneLanes) {
    // Cards Tagged IsBlocked
    var listCardsIsBlocked = [];
    for (var i = 0; i < listCards.length; i++) {
        var card = listCards[i];
        if (sprintLanes.includes(card.u_lanes[1].name) && !cardIsDone(card, doneLanes) && cardIsBlocked(card) === true) {
            // This is huddle card (tagged Huddle or Blocked)
            listCardsIsBlocked.push(card);
        }
    }
    return listCardsIsBlocked;
}

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
// private helper function
function getListCardsIsEarlyWin(listCards, sprintLanes, doneLanes) {
    // Cards Tagged IsEarlyWin
    var listCardsIsEarlyWin = [];
    for (var i = 0; i < listCards.length; i++) {
        var card = listCards[i];
        if (sprintLanes.includes(card.u_lanes[1].name) && !cardIsDone(card, doneLanes) && card["tags"].includes("Early Win")) {
            // This is huddle card (tagged Huddle or Blocked)
            listCardsIsEarlyWin.push(card);
        }
    }
    return listCardsIsEarlyWin;
}

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
// private helper function
function getListCardsIsSoon(listCards, sprintLanes, doneLanes) {
    // Cards Tagged IsSoon
    var listCardsIsSoon = [];
    for (var i = 0; i < listCards.length; i++) {
        var card = listCards[i];
        if (sprintLanes.includes(card.u_lanes[1].name) && !cardIsDone(card, doneLanes) && card["tags"].includes("Soon")) {
            // This is soon card (tagged "Soon")
            listCardsIsSoon.push(card);
        }
    }
    return listCardsIsSoon;
}

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
// private helper function
function getListCardsIsStretch(listCards, sprintLanes, doneLanes) {
    // Cards Tagged IsStretch
    var listCardsIsStretch = [];
    for (var i = 0; i < listCards.length; i++) {
        var card = listCards[i];
        if (sprintLanes.includes(card.u_lanes[1].name) && !cardIsDone(card, doneLanes) && card["tags"].includes("Stretch")) {
            // This is huddle card (tagged Huddle or Blocked)
            listCardsIsStretch.push(card);
        }
    }
    return listCardsIsStretch;
}

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
// private helper function
function getListCardsDoneToday(listCards, doneLanes) {
    var listCardsDoneToday = [];
    var today = new Date();
    var todayStr = sprintf("%04d-%02d-%2d", today.getFullYear(), today.getMonth() + 1, today.getDate());
    for (var i = 0; i < listCards.length; i++) {
        var card = listCards[i];
        // Example: 2019-02-20T16:15:22Z
        var lastMoveDay = card["movedOn"].split("T")[0];
        if (cardIsDone(card, doneLanes) && lastMoveDay === todayStr && card["type"]["title"] !== "Epic") {
            // This card Done Today
            listCardsDoneToday.push(card);
        }
    }
    return listCardsDoneToday;
}

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
// private helper function
function getListCardsDone(listCards, doneLanes) {
    // console.log("Looking for Cards Done");
    var listCardsDone = [];
    for (var i = 0; i < listCards.length; i++) {
        var card = listCards[i];
        if (cardIsDone(card, doneLanes) && card["type"]["title"] !== "Epic") {
            // This card is Done
            listCardsDone.push(card);
        }
    }
    return listCardsDone;
}

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
// private helper function
function getColorPerDay(theLabels, mainColor, highlightColor) {
    var today = new Date();
    var todayStr = sprintf("%d/%d", today.getMonth() + 1, today.getDate());
    // console.log(sprintf("   Today is %s", todayStr));
    var colorPerDay = [];
    for (var i = 0; i < theLabels.length; i++) {
        colorPerDay.push(mainColor);
        if (theLabels[i] === todayStr) colorPerDay[i] = highlightColor;
    }
    return colorPerDay;
}

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
// private helper function
function createBurnDownChart(listCards) {
    // Parse cards, get lanes, and figure out the sprint start/finish dates
    var [, , , , , startDate, , numDays] = getSprintInfo(listCards);

    // Compute array of labels for the chart
    var theLabels = getChartLabels(startDate, numDays);

    // Create array for colors, Set all datapoints to White, except set Today as Green
    var colorPerDay = getColorPerDay(theLabels, "white", "green");

    // Get three arrays, one for each of the lines of datapoints
    var [plannedPtsRemainingPerDay, unplannedPtsRemainingPerDay, burndownLinePerDay] = computeBurndownLines(listCards, theLabels);

    // - - - - - - - - - - - - Create Chart - - - - - - - - - -

    var burndownChart = {};

    burndownChart = {
        labels: theLabels,
        series: ["Planned", "Burndown", "Unplanned"],
        // Create empty data array, which is really an array of 3 empty arrays
        // (1) Planned Points Remaining Per Day, (2) Burndown line, (3) Unplanned Points Points Per Day
        data: [[], [], []],
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{ ticks: { stepSize: 10, min: 0 }, stacked: false, gridLines: { display: true, lineWidth: 4 } }],
                xAxes: [{ gridLines: { display: true, borderDash: [10, 5], lineWidth: 2 } }]
            }
        }
    };

    // Set (override) options for the Burndown Chart
    burndownChart.datasetOverride = [
        { pointBorderColor: colorPerDay, lineTension: 0.3, borderWidth: 10, borderColor: "rgb(170,124,57)" },
        {
            pointBorderColor: colorPerDay,
            lineTension: 0.0,
            borderWidth: 2,
            borderColor: "rgb(51,138,46)",
            backgroundColor: "rgba(111,37,111, 0.15)"
        },
        { pointBorderColor: colorPerDay, lineTension: 0.3, borderWidth: 4, borderColor: "rgb(111,37,111)" }
    ];

    // Set the datasets for the Burndown chart
    burndownChart.data[0] = plannedPtsRemainingPerDay;
    burndownChart.data[1] = burndownLinePerDay;
    burndownChart.data[2] = unplannedPtsRemainingPerDay;

    return burndownChart;
}

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
// private helper function
function createLeankitDataObject(cards, lanes) {
    let leankitDataObject = {};
    leankitDataObject["listCards"] = cards;

    // Enrich each card by adding URL field (BoardID is hard-coded)
    addURLtoCards(leankitDataObject["listCards"]);

    // Enrich each card by adding parent lanes
    // NOTE: Normally each card only knows about it's immediate parent lane, but I want to know about ALL parent lanes
    addParentLanestoCards(leankitDataObject["listCards"], lanes);

    // Enrich each card by computing the the Days card has been in current lane
    addDaysInLanetoCards(leankitDataObject["listCards"]);
    // Classify card as "Defect" or "Enhancement" (dependent on previous call to addParentLanestoCards)
    addCardTypetoCards(leankitDataObject["listCards"]);

    // Enrich each card by adding custome variable for days since creation
    addDaysSinceCreationtoCards(leankitDataObject["listCards"]);

    // Enrich each card by adding custome variable for days since update
    addDaysSinceUpdatetoCards(leankitDataObject["listCards"]);

    // Enrich each card by adding custom variable for card owner
    addCardOwnertoCards(leankitDataObject["listCards"]);

    // Create entire burndownChart
    leankitDataObject["burndownChart"] = createBurnDownChart(leankitDataObject["listCards"]);

    // Parse cards, get lanes, and figure out the sprint start/finish dates
    var sprintName, sprintLane, sprintLanes, doneLanes;
    [, sprintName, sprintLane, sprintLanes, doneLanes, , ,] = getSprintInfo(leankitDataObject["listCards"]);

    // Get total number of planned points
    [leankitDataObject["totalPlannedPoints"], leankitDataObject["totalUnplannedPoints"]] = getTotalPoints(
        leankitDataObject["listCards"],
        sprintLanes
    );

    // Widget: Leankit Stats
    leankitDataObject["leankitStats"] = getLeankitStats(
        leankitDataObject["listCards"],
        sprintName,
        sprintLanes,
        leankitDataObject["totalPlannedPoints"],
        doneLanes
    );

    // Widget: Points by Owner
    leankitDataObject["leankitCardOwners"] = getListPointsByOwner(leankitDataObject["listCards"], sprintLane);

    // Widget: Huddle Cards
    leankitDataObject["listCardsIsHuddle"] = getListCardsIsHuddle(leankitDataObject["listCards"], sprintLanes);

    // Widget: Blocked Cards
    leankitDataObject["listCardsIsBlocked"] = getListCardsIsBlocked(leankitDataObject["listCards"], sprintLanes, doneLanes);

    // Widget: Early Win Cards
    leankitDataObject["listCardsIsEarlyWin"] = getListCardsIsEarlyWin(leankitDataObject["listCards"], sprintLanes, doneLanes);

    // Widget: Soon Cards
    leankitDataObject["listCardsIsSoon"] = getListCardsIsSoon(leankitDataObject["listCards"], sprintLanes, doneLanes);

    // Widget: Stretch
    leankitDataObject["listCardsIsStretch"] = getListCardsIsStretch(leankitDataObject["listCards"], sprintLanes, doneLanes);

    // Widget: Done Today !
    leankitDataObject["listCardsDoneToday"] = getListCardsDoneToday(leankitDataObject["listCards"], doneLanes);

    // Widget: Done
    leankitDataObject["listCardsIsDone"] = getListCardsDone(leankitDataObject["listCards"], doneLanes);

    // Widget: Planned Cards (filter the list down)
    leankitDataObject["listCardsIsPlanned"] = leankitDataObject["listCards"].filter(function(el) {
        return (
            el.u_lanes[1].name === sprintLane &&
            el["type"]["title"] !== "Unplanned" &&
            !el.tags.includes("Stretch") &&
            !el.tags.includes("Soon")
        );
    });

    return leankitDataObject;

    // end of very large listCards function
}

// ========================================================================
async function getLeankitCards(leankitAPIHost, boardId, lane_class_types) {
    // For the API call, start at offset of 0 (beginning of cards).
    let offset = 0;
    // Try to get 1000 cards, though currently (2019), limit is 500 cards set by Leankit.  So, we'll get 500 cards, then increase our offset by that amount
    let limit = 1000;

    // For lane_class_types (function param), there are three values. You can pass multiple, separate by commas like 'lane_class_types=active,archive'
    //    'active' is the cards not in the backlog, and not in the Finished lane
    //    'backlog' is the cards in the backlog
    //    'archive' is everything in the Finished lane (whether or not its actually been archived yet)

    // Get leankit cards
    let response_cards_promise = apiProxy.get(
        // NOTE: if you modify this API path, there's a second looping call down below (so need to modify both)
        `/leankit-api/${leankitAPIHost}/io/card?board=${boardId}&limit=${limit}&offset=${offset}&lane_class_types=${lane_class_types}`
    );

    // Wait for both promises to finish (using the await keyboard from the async framework)
    let response_cards = await response_cards_promise;

    // Save a copy of this first batch of cards
    let leankitCards = response_cards.data.cards;

    // If the last card we got was less then the total number of cards, must mean there are more cards to get, start looping
    if (response_cards.data.pageMeta.endRow < response_cards.data.pageMeta.totalRecords) {
        // Set the offset equal to how many cards we got in the first call
        offset = response_cards.data.pageMeta.endRow;
        do {
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

    return leankitCards;
}
// ========================================================================
// Public method visible outside this file
export async function getEnhancedLeankitCardObject(leankitAPIHost, boardId, lane_class_types) {
    let leankit_cards = await getLeankitCards(leankitAPIHost, boardId, lane_class_types);

    // Get leankit lanes
    let response_lanes_promise = apiProxy.get(`/leankit-api/${leankitAPIHost}/io/board/${boardId}`);
    let leankit_lanes = await response_lanes_promise;

    // Construct a (somewhate elaborate) object representing the LeankitCards
    // Has additional custom fields, has additional arrays like "all blocked cards"
    let leankitDataObject = createLeankitDataObject(leankit_cards, leankit_lanes);

    return leankitDataObject;
}
// ========================================================================
// ========================================================================
// ========================================================================
