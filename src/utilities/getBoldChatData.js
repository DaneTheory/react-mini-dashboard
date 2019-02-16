import apiProxy from "../api/apiProxy";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export async function getBoldChatData(boldchat_instance, sn_instance) {
    // Load the data from the API (notice we're using the await keyword from the async framework)
    // Retrieve our data (likely from an API)
    const response = await apiProxy.get(`/boldchat/${boldchat_instance}/data/rest/json/v1/getActiveChats`, {
        params: {}
    });
    let boldChats = response.data.Data;

    // Create an object that we'll return, plus initailize counters
    let BoldChatData = {};
    BoldChatData["boldChatBot"] = 0;
    BoldChatData["boldChatAgent"] = 0;
    BoldChatData["nullcount"] = 0;

    // Loop through all chats
    boldChats.forEach(chat => {
        // If InitialQuestion field is present, but is only whitespace, make it say that so humans can read it
        if (chat.InitialQuestion && chat.InitialQuestion.match(/^\s+$/)) {
            chat.InitialQuestion = "<<whitespace>>";
        }

        // Differentiate between chats with Agent and chats with ChatBot
        // For ChatBot, you can check OperatorID == "830966298756797621" or DepartmentID == "831041769674595561"
        // Anthony says checking OperatorID is more accurate
        // Pablo gave me this gem, if the chat has an Answered time, then it was escalated
        chat.agent = "GSD";
        if (chat.OperatorID === "830966298756797621") {
            if (!chat.Answered) {
                // Update the question, so it's easier to spot in a list of active chats
                chat.InitialQuestion = "*** Talking with Chatbot ! ***";
                chat.agent = "chatbot";
            } else if (chat.Answered) {
                chat.InitialQuestion = "Escalated to Agent (Answered)";
                chat.escalated = "true";
                chat.agent = "GSD";
            }
        }
        // Accumulate a simple count of GSD agent-led chats, vs Chatbot-led chats, so we can display in a gauge
        if (chat.agent === "GSD") {
            BoldChatData["boldChatAgent"] += 1;
        } else {
            BoldChatData["boldChatBot"] += 1;
        }

        // If InitialQuestion field is blank/null, then make it say that so humans can read it
        if (!chat.InitialQuestion) {
            chat.InitialQuestion = "<<null>> (maybe user started with chatbot ?)";
            BoldChatData["nullcount"] += 1;
        }

        // End of chat loop
    });

    // Build an array of those WWIDs which do exist (Filtering out any chats where the WWID field is not populated in the CustomFields object)
    let wwidArray = boldChats
        .filter(function(chat) {
            if (chat.CustomFields && (chat.CustomFields.WWID || chat.CustomFields.customfield_wwid)) {
                // console.warn("chat without WWID", chat);
                return true;
            }
            return false;
        })
        .map(function(item) {
            // Seems that BoldChat puts WWID is put in two places (one field for chatbot, one for normal chat)
            return item.CustomFields.WWID || item.CustomFields.customfield_wwid;
        });

    // Convert array to a comma-separated string
    let wwids = wwidArray.join(",");
    // Call ServiceNow, and get an array of which of those WWIDS has the IT role (u_it_members)
    let role_response = await apiProxy.get(`/sn/${sn_instance}/api/now/table/sys_user_has_role`, {
        params: {
            sysparm_query: `user.employee_numberIN${wwids}^role.name=u_it_members`,
            sysparm_display_value: "true",
            sysparm_fields: "user.employee_number,user.name,role",
            sysparm_limit: 500
        }
    });

    // Create an array of just the WWIDS, and store into the returned data object for later use (e.g. highlighting in blue)
    BoldChatData["ITUsers"] = role_response.data.result.map(function(currUser) {
        return currUser["user.employee_number"];
    });

    // Store list of chats into object, and return object
    BoldChatData.chats = boldChats;
    return BoldChatData;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
