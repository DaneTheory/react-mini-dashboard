import React from "react";
import $ from "jquery";
import DashboardTableCard from "../components/DashboardTableCard";
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
        this.state = { widgetName: "firstwidget", count: [], instance: props.instance, textTable: textTable };
    }

    componentDidMount = () => {
        // Load the data from the API (notice we're using the await keyword from the async framework)

        function setScrollableTableSize(scrollingTableID) {
            let gridItem = $(scrollingTableID)
                .parent()
                .parent()
                .parent();
            let headerTable = gridItem.find(".headerTable");
            let bodyTableContainerDiv = gridItem.find(".bodyTableContainerDiv");
            let desiredTbodyHeight = gridItem.height() - headerTable.height() - 5;
            console.log("Desired height: ", desiredTbodyHeight);
            bodyTableContainerDiv.height(desiredTbodyHeight);
        }

        // Set height initially
        setScrollableTableSize("#chadTextTable01");

        // Set scroll bar to top
        $("#chadTextTable01")
            .parent()
            .scrollTop(0);

        // Start scroll animation
        // arg1: object os properties to animate
        // arg2: duration (millseconds ?)
        // arg3: easing function (e.g. linear, swing)
        // arg4: callback when complete
        // 473 (#chadTextTable01) - 186 (.bodyTableContainerDiv) = 287

        // Calculate how many pixel are outside the view, and can be scrolled
        console.log($("#chadTextTable01").height());
        console.log(
            $("#chadTextTable01")
                .parent()
                .height()
        );

        let scrollDistancePixles =
            $("#chadTextTable01").height() -
            $("#chadTextTable01")
                .parent()
                .height();
        console.log(scrollDistancePixles);

        $("#chadTextTable01")
            .parent()
            .animate(
                {
                    scrollTop: scrollDistancePixles
                },
                10000,
                "linear",
                function() {
                    console.log("Down Scroll Done");

                    $("#chadTextTable01")
                        .parent()
                        .stop()
                        .animate({ scrollTop: 0 }, 10000, "linear", function() {
                            console.log("Back at the top");
                        });
                }
            );

        // Listen for Window resizes
        window.addEventListener("resize", function() {
            console.log("Window resized");
            setScrollableTableSize("#chadTextTable01");
        });
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
                    <table id="chadTextTable01" className="scrollableTable">
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
