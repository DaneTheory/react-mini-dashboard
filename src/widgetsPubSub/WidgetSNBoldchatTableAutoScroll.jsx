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
class WidgetSNBoldchatTableAutoScroll extends React.PureComponent {
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

    // eslint-disable-next-line no-unused-vars
    async getDataAndUpdateState(msg = "Default message", data = "Default data") {
        // this function gets the custom data for this widget, and updates our React component state
        // function is called manually once at componentDidMount, and then repeatedly via a PubSub event, which includes msg/data

        // Get our data from API
        let BoldChatData = await getBoldChatData(this.props.boldchat_instance, this.props.sn_instance);

        // Manually remove ChatBot entries from the data
        BoldChatData.chats = BoldChatData.chats.filter(chat => !chat["InitialQuestion"].includes("Talking with Chatbot"));

        // Update our own state with the new data
        this.setState({ BoldChatData: BoldChatData });
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    componentDidMount = async () => {
        // Standard React Lifecycle method, gets called by React itself
        // React calls this once after component gets "mounted", in other words called *after* the render() method below

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
