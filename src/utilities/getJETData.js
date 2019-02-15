import apiProxy from "../api/apiProxy";

// These have to be after imports
var strftime = require("strftime");
var moment = require("moment");

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

async function JETGetDataOnsiteSupportClosedINC(agoCount, agoUnits, sn_instance) {
    // JETOnsiteSupportClosedINC
    let desksideServicesL2 = "d5f37b8d0a0a3c5f01ddc2e63933dd51";
    let LMW = "d5f37b800a0a3c5f00ba3dabf02d7997";
    let feetOnTheStreet = "e6c3f57ea9aa2c04705be10945347396";
    let sq1 = `u_resolved_by_group=${desksideServicesL2}^ORu_resolved_by_group=${LMW}^ORu_resolved_by_group=${feetOnTheStreet}`;
    let sq2 = "contact_type!=Bright Red^contact_type!=Bright Red PT";
    let sq3 = `closed_at>=javascript:gs.${agoUnits}AgoStart(${agoCount})`;

    // Retrieve our data (likely from an API)
    const response = await apiProxy.get(`/sn/${sn_instance}/api/now/stats/incident`, {
        params: {
            // Units: years, months, days, hours, minutes
            sysparm_query: [sq1, sq2, sq3].join("^"),
            sysparm_count: "true",
            sysparm_display_value: "true"
        }
    });
    let JETOnsiteSupportClosedINC = parseInt(response.data.result.stats.count);
    return JETOnsiteSupportClosedINC;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

async function JETGetDataOnsiteSupportClosedTasks(agoCount, agoUnits, sn_instance) {
    // JETOnsiteSupportClosedTasks
    let desksideServicesL2 = "d5f37b8d0a0a3c5f01ddc2e63933dd51";
    let LMW = "d5f37b800a0a3c5f00ba3dabf02d7997";
    let feetOnTheStreet = "e6c3f57ea9aa2c04705be10945347396";
    let sq1 = `assignment_group=${desksideServicesL2}^ORassignment_group=${LMW}^ORassignment_group=${feetOnTheStreet}`;
    let sq2 = `closed_at>=javascript:gs.${agoUnits}AgoStart(${agoCount})`;

    // Retrieve our data (likely from an API)
    const response = await apiProxy.get(`/sn/${sn_instance}/api/now/stats/sc_task`, {
        params: {
            // Units: years, months, days, hours, minutes
            sysparm_query: [sq1, sq2].join("^"),
            sysparm_count: "true",
            sysparm_display_value: "true"
        }
    });
    let JETOnsiteSupportClosedTasks = parseInt(response.data.result.stats.count);
    return JETOnsiteSupportClosedTasks;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

async function JETGetDataOnsiteSupportCombined(agoCount, agoUnits, sn_instance) {
    let JETOnsiteSupportClosedINC = await JETGetDataOnsiteSupportClosedINC(agoCount, agoUnits, sn_instance);
    let JETOnsiteSupportClosedTasks = await JETGetDataOnsiteSupportClosedTasks(agoCount, agoUnits, sn_instance);
    return JETOnsiteSupportClosedINC + JETOnsiteSupportClosedTasks;
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

async function JETGetDataRemoteResolutionINC(agoCount, agoUnits, sn_instance) {
    let RCC = "ed43150ba92e6c04705be109453473ee";
    let sq1 = `u_resolved_by_group=${RCC}`;
    let sq2 = `closed_at>=javascript:gs.${agoUnits}AgoStart(${agoCount})`;

    // Retrieve our data (likely from an API)
    const response = await apiProxy.get(`/sn/${sn_instance}/api/now/stats/incident`, {
        params: {
            // Units: years, months, days, hours, minutes
            sysparm_query: [sq1, sq2].join("^"),
            sysparm_count: "true",
            sysparm_display_value: "true"
        }
    });
    let JETRemoteResolutionINC = parseInt(response.data.result.stats.count);
    return JETRemoteResolutionINC;
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
async function JETGetDataBoldChatReport(agoCount, agoUnits, boldchat_instance) {
    // Compute intial FromDate based on desired history (agoUnits and agoCount)
    let fromDateString = strftime(
        "%Y-%m-%dT%H:%M:01.000Z",
        moment()
            .subtract(parseInt(agoCount), agoUnits)
            .toDate()
    );
    // Compute the "to" date to be one hour into the future, just to be sure
    let toDateString = strftime(
        "%Y-%m-%dT%H:%M:01.000Z",
        moment()
            .add(1, "hours")
            .toDate()
    );
    let folderID = "965423669295807313";

    let responseRunReport = await apiProxy.get(`/boldchat/${boldchat_instance}/data/rest/json/v1/runReport`, {
        params: {
            ReportType: "0",
            Grouping: "date",
            FromDate: fromDateString,
            ToDate: toDateString,
            FolderID: folderID
        }
    });
    let ReportID = responseRunReport.data.Data.ReportID;

    // Get the status report that we just started. NOTE: we may need to loop a few times until it's done (goes from "running" to "success")
    let reportStatus, responseGetReport;
    do {
        responseGetReport = await apiProxy.get(`/boldchat/${boldchat_instance}/data/rest/json/v1/getReport`, {
            params: { ReportID: ReportID }
        });

        // can be "running" or "success"
        reportStatus = responseGetReport.data.Status;
        // console.log("Report Status", responseGetReport.data.Status);
    } while (reportStatus !== "success");

    let report = responseGetReport.data.Data;
    return report;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
async function JETGetDataBoldChatAnswered(agoCount, agoUnits, boldchat_instance) {
    let boldChatReport = await JETGetDataBoldChatReport(agoCount, agoUnits, boldchat_instance);

    // console.log("totalClicks: ", report.Summary[1]["Value"]);
    // console.log("Unavail: ", report.Summary[2]["Value"]);
    // console.log("Blocked: ", report.Summary[3]["Value"]);
    // console.log("Abandon: ", report.Summary[4]["Value"]);
    // console.log("Unanswer: ", report.Summary[5]["Value"]);
    // console.log("Answered: ", report.Summary[6]["Value"]);

    let answeredChats = boldChatReport.Summary[6]["Value"];
    return answeredChats;
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
async function JETGetDataBoldChatUnAnswered(agoCount, agoUnits, boldchat_instance) {
    let boldChatReport = await JETGetDataBoldChatReport(agoCount, agoUnits, boldchat_instance);

    // 6th field (index 5) is Unanswered Chats (see previous function JETGetDataBoldChatAnswered() for all fields)
    let answeredChats = boldChatReport.Summary[5]["Value"];
    return answeredChats;
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
async function JETGetDataPortalContacts(agoCount, agoUnits, sn_instance) {
    let globalServiceDesk = "43a8eef644e71000f9aca72b4342c01a";
    let sq1 = `u_owned_by_group=${globalServiceDesk}`;
    let sq2 = "contact_type=self-service";
    let sq3 = `sys_updated_on>=javascript:gs.${agoUnits}AgoStart(${agoCount})`;
    let sq4 = `sys_created_on>=javascript:gs.${agoUnits}AgoStart(${agoCount})`;

    // Retrieve our data (likely from an API)
    const response = await apiProxy.get(`/sn/${sn_instance}/api/now/stats/incident`, {
        params: {
            // Units: years, months, days, hours, minutes
            sysparm_query: [sq1, sq2, sq3, sq4].join("^"),
            sysparm_count: "true",
            sysparm_display_value: "true"
        }
    });
    let JETPortalContacts = parseInt(response.data.result.stats.count);
    return JETPortalContacts;
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
async function JETGetDataGenesysCTIByLang(agoCount, agoUnits, sn_instance) {
    // var url6 = querySetup(urlBase, query, factoryProfile, "JETGenesysCTIByLang", agoUnits, agoCount);
    // JSONResults = getAggregateGroupBy(currentProfile, "u_genesys_cti_log", ["u_language"], "sysparm_query=sys_created_on>=javascript:gs.%sAgoStart(%s)" % (agoUnits, agoCount))

    let groupby_field = "u_language";
    let response = await apiProxy.get(`/sn/${sn_instance}/api/now/stats/u_genesys_cti_log`, {
        params: {
            // Units for xAgoStart: years, months, days, hours, minutes
            sysparm_query: `sys_created_on>=javascript:gs.${agoUnits}AgoStart(${agoCount})`,
            sysparm_count: "true",
            sysparm_display_value: "true",
            sysparm_group_by: groupby_field
        }
    });

    // Restructure the ServiceNow response (somewhat deep object) into an array of simple objects
    let languageCounts = response.data.result.map(element => {
        return {
            // the brackets around [groupby_field] allow me to use a variable as a key name within the new object
            [groupby_field]: element["groupby_fields"][0]["value"] || "<blank>",
            count: element.stats.count
        };
    });

    // Parse information about all Genesys Phone Call Languages
    let voiceConsumptionUnits = {};
    languageCounts.forEach(record => {
        // console.log("record", record);
        var consumptionUnit = "";

        var lang = record["u_language"];
        var count = parseInt(record["count"]);
        // console.log("lang", lang);
        if (["GERMAN", "FRENCH", "DUTCH", "RUSSIAN", "ITALIAN"].includes(lang)) {
            consumptionUnit = "VoiceEMEA";
        } else if (["SPANISH", "PORTUGUESE", "CANADIAN"].includes(lang)) {
            consumptionUnit = "VoiceLATAM";
        } else if (["JAPANESE", "MANDARIN", "KOREAN"].includes(lang)) {
            consumptionUnit = "VoiceASPAC";
        } else if (["ENGLISH"].includes(lang)) {
            consumptionUnit = "VoiceEnglish";
        } else {
            console.warn("Error, lang wasn't found: " + lang);
            consumptionUnit = "Voice (Unknown)";
        }

        // Accumulate an object which has the sum counts of each voice consumption unit
        voiceConsumptionUnits[consumptionUnit] = voiceConsumptionUnits.hasOwnProperty(consumptionUnit)
            ? voiceConsumptionUnits[consumptionUnit] + count
            : count;
    });
    return voiceConsumptionUnits;
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function computeVariance(JETconsumptionUnits) {
    Object.entries(JETconsumptionUnits).forEach(([key, value]) => {
        value.pctOfTarget = value.count / value.weeklyTargetCount;
        value.targetCost = value.unitCost * value.weeklyTargetCount;
        value.actualCost = value.unitCost * value.count;
        value.dollarVariance = value.actualCost - value.targetCost;
    });

    return JETconsumptionUnits;
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export async function getJETData(sn_instance, boldchat_instance) {
    // Call all JETGetData* functions in parallel, waiting for all of them to finish before proceeding
    let [
        JETOnsiteSupport,
        JETRemoteResolutionINC,
        boldChatAnswered,
        boldChatUnAnswered,
        JETPortalContacts,
        voiceConsumptionUnits
    ] = await Promise.all([
        JETGetDataOnsiteSupportCombined("168", "hours", sn_instance),
        JETGetDataRemoteResolutionINC("168", "hours", sn_instance),
        JETGetDataBoldChatAnswered("168", "hours", boldchat_instance),
        JETGetDataBoldChatUnAnswered("168", "hours", boldchat_instance),
        JETGetDataPortalContacts("168", "hours", sn_instance),
        JETGetDataGenesysCTIByLang("168", "hours", sn_instance)
    ]);

    // Show what we got
    // console.log("JETOnsiteSupport", JETOnsiteSupport);
    // console.log("JETRemoteResolutionINC", JETRemoteResolutionINC);
    // console.log("boldChatAnswered", boldChatAnswered);
    // console.log("JETPortalContacts", JETPortalContacts);
    // console.log("voiceConsumptionUnits", voiceConsumptionUnits);

    // Take the data we got back, and insert into a more complete data structure which includes targets and unit costs
    let JETconsumptionUnits = {
        JETchatBotContact: {
            name: "Bot Contact (UnAnswr Chat)",
            order: 50,
            count: boldChatUnAnswered,
            unitCost: 0.0,
            weeklyTargetCount: 10000
        },
        JETchatContact: { name: "Chat Contact", order: 100, count: boldChatAnswered, unitCost: 4.64, weeklyTargetCount: 10277 },
        JETPortalContacts: { name: "Portal Contact", order: 200, count: JETPortalContacts, unitCost: 4.64, weeklyTargetCount: 4304 },
        VoiceEnglish: {
            name: "Voice (English)",
            order: 300,
            count: voiceConsumptionUnits["VoiceEnglish"],
            unitCost: 6.25,
            weeklyTargetCount: 4525
        },
        VoiceASPAC: {
            name: "Voice (ASPAC)",
            order: 400,
            count: voiceConsumptionUnits["VoiceASPAC"],
            unitCost: 9.44,
            weeklyTargetCount: 1443
        },
        VoiceLATAM: {
            name: "Voice (LATAM)",
            order: 500,
            count: voiceConsumptionUnits["VoiceLATAM"],
            unitCost: 10.54,
            weeklyTargetCount: 2288
        },
        VoiceEMEA: {
            name: "Voice (EMEA)",
            order: 600,
            count: voiceConsumptionUnits["VoiceEMEA"],
            unitCost: 24.86,
            weeklyTargetCount: 1901
        },
        JETRemoteResolutionINC: {
            name: "Remote Resolution",
            order: 700,
            count: JETRemoteResolutionINC,
            unitCost: 25.58,
            weeklyTargetCount: 1299
        },
        JETOnsiteSupport: {
            name: "Onsite Support",
            order: 800,
            count: JETOnsiteSupport,
            unitCost: 95.0,
            weeklyTargetCount: 5536
        }
    };

    JETconsumptionUnits = computeVariance(JETconsumptionUnits);

    // Object.entries(voiceConsumptionUnits).forEach(([key, value]) => {
    //     console.log(key, value);
    //     JETconsumptionUnits[key] = { count: value };
    // });
    return JETconsumptionUnits;
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
