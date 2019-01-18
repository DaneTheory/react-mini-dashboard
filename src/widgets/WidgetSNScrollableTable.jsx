import React from "react";
import DashboardTableCard from "../components/DashboardTableCard";

import * as scrollableTable from "../utilities/autoScrollTableUtilities";
// import apiProxy from "../api/apiProxy";

// Create a class component
class WidgetSNScrollableTable extends React.Component {
    constructor(props) {
        super(props);
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
            widgetName: "firstwidget",
            count: [],
            instance: props.instance,
            textTable: textTable,
            scrollableDivIDSelector: "chadTextTable01"
        };
    }

    componentDidMount = () => {
        // Load the data from the API (notice we're using the await keyword from the async framework)

        // Set height initially
        scrollableTable.setTableSizeViaJquery("#" + this.state.scrollableDivIDSelector);

        // Set scroll bar to top (React seems to remember the scroll position, so we need to set it to the top)
        scrollableTable.scrollToTop("#" + this.state.scrollableDivIDSelector);

        // Start the window scroll
        scrollableTable.initScroll("#" + this.state.scrollableDivIDSelector, 7);

        // Listen for Window resize, and when that happens, re-compute the size of the scrollable div
        // Need to create an IIFE so that closure remembers value of the name of our div
        (function(divSelector) {
            window.addEventListener("resize", function() {
                // console.log("Window resized");
                scrollableTable.setTableSizeViaJquery("#" + divSelector);
            });
        })(this.state.scrollableDivIDSelector);
    };

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

    // ########################################################################################

    // end of class
}

export default WidgetSNScrollableTable;
