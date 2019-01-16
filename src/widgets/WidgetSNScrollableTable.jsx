import React from "react";
import DashboardDataCard from "../components/DashboardDataCard";
// import apiProxy from "../api/apiProxy";

// Create a class component
class WidgetSNScrollableTable extends React.Component {
    constructor(props) {
        super(props);
        let textTable = [
            { name: "Chad", text: "Text 01" },
            { name: "Fred", text: "Text 02" },
            { name: "Barney", text: "Text 03" },
            { name: "Wilma", text: "Text 04" }
        ];
        this.state = { widgetName: "firstwidget", count: [], instance: props.instance, textTable: textTable };
    }

    componentDidMount = () => {
        // Load the data from the API (notice we're using the await keyword from the async framework)
    };

    renderTable() {
        return (
            <div style={{ fontSize: "1.6vw" }}>
                <table>
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
        );
    }

    renderCardBody() {
        return <div className="item">{this.renderTable()}</div>;
    }

    render() {
        return (
            <DashboardDataCard
                id={this.props.id}
                position={this.props.position}
                color={this.props.color}
                widgetName="WidgetSNScrollableTable"
            >
                {this.renderCardBody()}
            </DashboardDataCard>
        );
    }

    // ########################################################################################

    // end of class
}

export default WidgetSNScrollableTable;
