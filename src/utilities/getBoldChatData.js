import apiProxy from "../api/apiProxy";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export async function getBoldChatData(boldchat_instance) {
    // Load the data from the API (notice we're using the await keyword from the async framework)
    // Retrieve our data (likely from an API)
    const response = await apiProxy.get(`/boldchat/${boldchat_instance}/data/rest/json/v1/getActiveChats`, {
        params: {}
    });

    let boldChats = response.data.Data;
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

        // If InitialQuestion field is blank/null, then make it say that so humans can read it
        if (!chat.InitialQuestion) {
            chat.InitialQuestion = "<<null>>";
        }

        // End of chat loop
    });

    let BoldChatData = {
        chats: boldChats
    };
    console.log("resonse from boldchat", BoldChatData);

    return BoldChatData;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
