// 3rd party imports
import React from "react";
import PropTypes from "prop-types";
import PubSub from "pubsub-js";

// project imports
import DashboardTableCard from "../components/DashboardTableCard";
import { getBoldChatData } from "../utilities/getBoldChatData";

// Import utility functions for constructing/scrolling our scrollable table
import * as scrollableTable from "../utilities/autoScrollTableUtilities";

// other imports
var classNames = require("classnames");

// The purpose of this file is to create a React Component which can be included in HTML
// This is a self-contained class which knows how to get it's own data, and display it in HTML

// Create a React class component, everything below this is a class method (i.e. a function attached to the class)
class WidgetSNBoldchatTableAutoScroll extends React.Component {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    constructor(props) {
        // This gets called when the widget is invoked

        // React constructor() requires us to call super()
        super(props);

        this.state = {
            widgetName: "WidgetSNBoldchatTableAutoScroll",
            BoldChatData: { chats: [] },
            scrollableDivIDSelector: "chadTextTable02"
        };

        // This is out event handler, it's called from outside world via an event subscription, and when called, it
        // won't know about "this", so we need to bind our current "this" to "this" within the function
        this.getDataAndUpdateState = this.getDataAndUpdateState.bind(this);
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    createFakeBoldChatDataForScrollingDebugging() {
        let fakeBoldChatData = {
            boldChatAgent: 2,
            boldChatBot: 3,
            ITUsers: [1, 2, 3],
            chats: [
                { ChatName: "N101", CustomFields: { WWID: 101 }, ChatID: 101, InitialQuestion: "question01" },
                { ChatName: "N102", CustomFields: { WWID: 102 }, ChatID: 102, InitialQuestion: "question02" },
                { ChatName: "N103", CustomFields: { WWID: 103 }, ChatID: 103, InitialQuestion: "question03" },
                { ChatName: "N104", CustomFields: { WWID: 104 }, ChatID: 104, InitialQuestion: "question04" },
                { ChatName: "N105", CustomFields: { WWID: 105 }, ChatID: 105, InitialQuestion: "question05" },
                { ChatName: "N106", CustomFields: { WWID: 106 }, ChatID: 106, InitialQuestion: "question06" },
                { ChatName: "N107", CustomFields: { WWID: 107 }, ChatID: 107, InitialQuestion: "question07" },
                { ChatName: "N108", CustomFields: { WWID: 108 }, ChatID: 108, InitialQuestion: "question08" },
                { ChatName: "N109", CustomFields: { WWID: 109 }, ChatID: 109, InitialQuestion: "question09" },
                { ChatName: "N110", CustomFields: { WWID: 110 }, ChatID: 110, InitialQuestion: "question10" },
                { ChatName: "N111", CustomFields: { WWID: 111 }, ChatID: 111, InitialQuestion: "question11" },
                { ChatName: "N112", CustomFields: { WWID: 112 }, ChatID: 112, InitialQuestion: "question12" },
                { ChatName: "N113", CustomFields: { WWID: 113 }, ChatID: 113, InitialQuestion: "question13" },
                { ChatName: "N114", CustomFields: { WWID: 114 }, ChatID: 114, InitialQuestion: "question14" },
                { ChatName: "N115", CustomFields: { WWID: 115 }, ChatID: 115, InitialQuestion: "question15" },
                { ChatName: "N116", CustomFields: { WWID: 116 }, ChatID: 116, InitialQuestion: "question16" },
                { ChatName: "N117", CustomFields: { WWID: 117 }, ChatID: 117, InitialQuestion: "question17" },
                { ChatName: "N118", CustomFields: { WWID: 118 }, ChatID: 118, InitialQuestion: "question18" },
                { ChatName: "N119", CustomFields: { WWID: 119 }, ChatID: 119, InitialQuestion: "question19" },
                { ChatName: "N120", CustomFields: { WWID: 120 }, ChatID: 120, InitialQuestion: "question20" },
                { ChatName: "N121", CustomFields: { WWID: 121 }, ChatID: 121, InitialQuestion: "question21" },
                { ChatName: "N122", CustomFields: { WWID: 122 }, ChatID: 122, InitialQuestion: "question22" },
                { ChatName: "N123", CustomFields: { WWID: 123 }, ChatID: 123, InitialQuestion: "question23" },
                { ChatName: "N124", CustomFields: { WWID: 124 }, ChatID: 124, InitialQuestion: "question24" },
                { ChatName: "N125", CustomFields: { WWID: 125 }, ChatID: 125, InitialQuestion: "question25" },
                { ChatName: "N126", CustomFields: { WWID: 126 }, ChatID: 126, InitialQuestion: "question26" },
                { ChatName: "N127", CustomFields: { WWID: 127 }, ChatID: 127, InitialQuestion: "question27" },
                { ChatName: "N128", CustomFields: { WWID: 128 }, ChatID: 128, InitialQuestion: "question28" },
                { ChatName: "N129", CustomFields: { WWID: 129 }, ChatID: 129, InitialQuestion: "question29" },
                { ChatName: "N130", CustomFields: { WWID: 130 }, ChatID: 130, InitialQuestion: "question30" },
                { ChatName: "N131", CustomFields: { WWID: 131 }, ChatID: 131, InitialQuestion: "question31" },
                { ChatName: "N132", CustomFields: { WWID: 132 }, ChatID: 132, InitialQuestion: "question32" },
                { ChatName: "N133", CustomFields: { WWID: 133 }, ChatID: 133, InitialQuestion: "question33" },
                { ChatName: "N134", CustomFields: { WWID: 134 }, ChatID: 134, InitialQuestion: "question34" },
                { ChatName: "N135", CustomFields: { WWID: 135 }, ChatID: 135, InitialQuestion: "question35" },
                { ChatName: "N136", CustomFields: { WWID: 136 }, ChatID: 136, InitialQuestion: "question36" },
                { ChatName: "N137", CustomFields: { WWID: 137 }, ChatID: 137, InitialQuestion: "question37" },
                { ChatName: "N138", CustomFields: { WWID: 138 }, ChatID: 138, InitialQuestion: "question38" },
                { ChatName: "N139", CustomFields: { WWID: 139 }, ChatID: 139, InitialQuestion: "question39" },
                { ChatName: "N140", CustomFields: { WWID: 140 }, ChatID: 140, InitialQuestion: "question40" },
                { ChatName: "N141", CustomFields: { WWID: 141 }, ChatID: 141, InitialQuestion: "question41" },
                { ChatName: "N142", CustomFields: { WWID: 142 }, ChatID: 142, InitialQuestion: "question42" },
                { ChatName: "N143", CustomFields: { WWID: 143 }, ChatID: 143, InitialQuestion: "question43" },
                { ChatName: "N144", CustomFields: { WWID: 144 }, ChatID: 144, InitialQuestion: "question44" },
                { ChatName: "N145", CustomFields: { WWID: 145 }, ChatID: 145, InitialQuestion: "question45" },
                { ChatName: "N146", CustomFields: { WWID: 146 }, ChatID: 146, InitialQuestion: "question46" },
                { ChatName: "N147", CustomFields: { WWID: 147 }, ChatID: 147, InitialQuestion: "question47" },
                { ChatName: "N148", CustomFields: { WWID: 148 }, ChatID: 148, InitialQuestion: "question48" }
            ]
        };
        return fakeBoldChatData;
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // eslint-disable-next-line no-unused-vars
    async getDataAndUpdateState(msg = "Default message", data = "Default data") {
        // this function gets the custom data for this widget, and updates our React component state
        // function is called manually once at componentDidMount, and then repeatedly via a PubSub event, which includes msg/data

        // Get our data from API
        let BoldChatData = await getBoldChatData(this.props.boldchat_instance, this.props.sn_instance);
        // let BoldChatData = this.createFakeBoldChatDataForScrollingDebugging();

        // Update our own state with the new data
        this.setState({ BoldChatData: BoldChatData });
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    componentDidMount = async () => {
        // Standard React Lifecycle method, gets called by React itself
        // React calls this once after component gets "mounted", in other words called *after* the render() method below

        console.log("TableAutoScroll: componentDidMount()");

        // manual update of our own data
        this.getDataAndUpdateState();

        // Now listen for update requests by subscribing to update events
        PubSub.subscribe("updateWidgetsEvent", this.getDataAndUpdateState);
    };

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    componentDidUpdate() {
        // Standard React Lifecycle method, gets called by React itself
        // console.log("TableAutoScroll: componentDidUpdate(), which starts scrolling");

        // Set initial height of table
        scrollableTable.setTableSizeViaJquery("#" + this.state.scrollableDivIDSelector);

        // Move scroll bar to top (React seems to remember the scroll position, so we need to set it to the top)
        scrollableTable.scrollToTop("#" + this.state.scrollableDivIDSelector);

        // Start the window scroll, 2nd arg is scroll length in seconds
        scrollableTable.initScroll("#" + this.state.scrollableDivIDSelector, this.props.scrollDuration);

        // Listen for Window resize, and when that happens, re-compute the size of the scrollable div
        // Need to create an IIFE so that closure remembers value of the name of our div
        (function(divSelector) {
            window.addEventListener("resize", function() {
                // console.log("Window resized");
                scrollableTable.setTableSizeViaJquery("#" + divSelector);
            });
        })(this.state.scrollableDivIDSelector);
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    componentWillUnmount() {
        // Standard React Lifecycle method, gets called by React itself
        // Gets called once before React unmounts and destroys our component

        // Unsubscribe from all pubsub events
        PubSub.unsubscribe(this.getDataAndUpdateState);
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    renderTable() {
        return (
            <div className="fullCardContainer">
                {/* Table that contains "Header" */}
                <table className="headerTable">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>WWID</th>
                            <th>Initial Question</th>
                        </tr>
                    </thead>
                </table>

                {/* Table that contains "Body" */}
                <div className="bodyTableContainerDiv">
                    <table id={this.state.scrollableDivIDSelector} className="scrollableTable">
                        <tbody>
                            {this.state.BoldChatData.chats.map((chat, index) => {
                                // If IT User, then highlight them
                                // Seems that BoldChat puts WWID is put in two places (one field for chatbot, one for normal chat)
                                let WWID =
                                    (chat["CustomFields"] && chat["CustomFields"]["WWID"]) ||
                                    (chat["CustomFields"] && chat["CustomFields"]["customfield_wwid"]) ||
                                    "No WWID";
                                let ChatName = chat["ChatName"];
                                let chatNameFontColor = null;
                                if (this.state.BoldChatData.ITUsers.includes(WWID)) {
                                    ChatName = ChatName + " (IT User)";
                                    chatNameFontColor = "blueFont";
                                }
                                let chatInitialQuestionFontColor = chat["InitialQuestion"].includes("Talking with Chatbot")
                                    ? "greenFont"
                                    : null;
                                // Create the HTML table row
                                return (
                                    <tr key={chat["ChatID"]}>
                                        <td>{index + 1}</td>
                                        <td className={classNames(chatNameFontColor)}>{ChatName}</td>
                                        <td>{WWID}</td>
                                        <td className={classNames(chatInitialQuestionFontColor)}>{chat["InitialQuestion"]}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    render() {
        // Standard React Lifecycle method, gets called by React itself
        // Get called every time the "state" object gets modified, in other words setState() was called
        // Also called if "props" are modified (which are passed from the parent)

        // console.log("TableAutoScroll:render()");

        return (
            <DashboardTableCard
                id={this.props.id}
                position={this.props.position}
                color={this.props.color}
                widgetName="WidgetSNBoldchatTableAutoScroll"
            >
                <div className="single-num-title">Boldchat (Currently Active)</div>
                {this.renderTable()}
            </DashboardTableCard>
        );
    }
}

// -------------------------------------------------------------------------------------------------------
// We're outside the class now, just need to define a few additional things
// -------------------------------------------------------------------------------------------------------

// Set default props in case they aren't passed to us by the caller
WidgetSNBoldchatTableAutoScroll.defaultProps = {
    scrollDuration: 60
};

// Force the caller to include the proper attributes
WidgetSNBoldchatTableAutoScroll.propTypes = {
    id: PropTypes.string,
    position: PropTypes.string.isRequired,
    color: PropTypes.string,
    boldchat_instance: PropTypes.string.isRequired,
    sn_instance: PropTypes.string.isRequired,
    scrollDuration: PropTypes.number.isRequired
};

// If we (this file) get "imported", this is what they'll be given
export default WidgetSNBoldchatTableAutoScroll;

// =======================================================================================================
// =======================================================================================================
