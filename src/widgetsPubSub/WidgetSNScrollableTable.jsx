// 3rd party imports
import React from "react";
import PropTypes from "prop-types";
import PubSub from "pubsub-js";

// project imports
import DashboardTableCard from "../components/DashboardTableCard";
// Import utility functions for constructing/scrolling our scrollable table
import * as scrollableTable from "../utilities/autoScrollTableUtilities";

// The purpose of this file is to create a React Component which can be included in HTML
// This is a self-contained class which knows how to get it's own data, and display it in HTML

// Create a React class component, everything below this is a class method (i.e. a function attached to the class)
class WidgetSNScrollableTable extends React.Component {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    constructor(props) {
        // This gets called when the widget is invoked

        // React constructor() requires us to call super()
        super(props);

        // Set our initial React state, this is the *only* time to bypass setState()
        let textTable = [
            { name: "Chad", text: "Text 01" },
            { name: "Fred", text: "Text 02" },
            { name: "Barney", text: "Text 03" },
            { name: "Wilma", text: "Text 04" },
            { name: "Pebbles", text: "Text 05" },
            { name: "Bam-Bam", text: "Text 06" },
            { name: "The Dinosaur", text: "Text 07" },
            { name: "Fred2", text: "Text 02" },
            { name: "Barney2", text: "Text 03" },
            { name: "Wilma2", text: "Text 04" },
            { name: "Pebbles2", text: "Text 05" },
            { name: "Bam-Bam2", text: "Text 06" },
            { name: "The Dinosaur2", text: "Text 07" },
            { name: "Fred3", text: "Text 02" },
            { name: "Barney3", text: "Text 03" },
            { name: "Wilma3", text: "Text 04" },
            { name: "Pebbles3", text: "Text 05" },
            { name: "Bam-Bam3", text: "Text 06" },
            { name: "The Dinosaur3", text: "Text 07" },
            { name: "Fred4", text: "Text 02" },
            { name: "Barney4", text: "Text 03" },
            { name: "Wilma4", text: "Text 04" },
            { name: "Pebbles4", text: "Text 05" },
            { name: "Bam-Bam4", text: "Text 06" },
            { name: "The Dinosaur4", text: "Text 07" }
        ];
        this.state = {
            widgetName: "WidgetSNScrollableTable",
            count: [],
            instance: props.instance,
            textTable: textTable,
            scrollableDivIDSelector: "chadTextTable01"
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

        // Load the data from the API (notice we're using the await keyword from the async framework)

        // Set height initially
        scrollableTable.setTableSizeViaJquery("#" + this.state.scrollableDivIDSelector);

        // Set scroll bar to top (React seems to remember the scroll position, so we need to set it to the top)
        scrollableTable.scrollToTop("#" + this.state.scrollableDivIDSelector);

        // Start the window scroll
        scrollableTable.initScroll("#" + this.state.scrollableDivIDSelector, 25);

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

    componentDidMount = async () => {
        // Standard React Lifecycle method, gets called by React itself
        // React calls this once after component gets "mounted", in other words called *after* the render() method below

        // manual update of our own data
        this.getDataAndUpdateState();

        // Now listen for update requests by subscribing to update events
        PubSub.subscribe("updateWidgetsEvent", this.getDataAndUpdateState);
    };

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
                            <th>Text</th>
                        </tr>
                    </thead>
                </table>

                {/* Table that contains "Body" */}
                <div className="bodyTableContainerDiv">
                    <table id={this.state.scrollableDivIDSelector} className="scrollableTable">
                        <tbody>
                            {Object.values(this.state.textTable)
                                .sort((a, b) => {
                                    return b.pct - a.pct;
                                })
                                .map(value => (
                                    <tr key={value["name"]}>
                                        <td>{value["name"]}</td>
                                        <td>{value["text"]}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    render() {
        return (
            <DashboardTableCard
                id={this.props.id}
                position={this.props.position}
                color={this.props.color}
                widgetName="WidgetSNScrollableTable"
            >
                {this.renderTable()}
            </DashboardTableCard>
        );
    }
}

// -------------------------------------------------------------------------------------------------------
// We're outside the class now, just need to define a few additional things
// -------------------------------------------------------------------------------------------------------

// Force the caller to include the proper attributes
WidgetSNScrollableTable.propTypes = {
    id: PropTypes.string,
    position: PropTypes.string.isRequired,
    color: PropTypes.string
};

// Set default props in case they aren't passed to us by the caller
WidgetSNScrollableTable.defaultProps = {};

// If we (this file) get "imported", this is what they'll be given
export default WidgetSNScrollableTable;

// =======================================================================================================
// =======================================================================================================
