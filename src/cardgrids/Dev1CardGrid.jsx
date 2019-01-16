import React from "react";
import WidgetSNBarChart from "../widgets/WidgetSNBarChart";
import WidgetSNScrollableTable from "../widgets/WidgetSNScrollableTable";

import CardGrid from "../components/cardGrid";

class Dev1CardGrid extends React.Component {
    constructor(props) {
        super(props);
        props.changeParentPageTitle("Dev1 Dashboard");
    }

    componentDidMount() {}

    render() {
        return (
            <div>
                <CardGrid rows="10" columns="12">
                    <WidgetSNBarChart color="#ddd" position="span 3 / span 4" instance={this.props.sn_instance} />
                    <WidgetSNScrollableTable position="span 4 / span 3" />
                </CardGrid>
            </div>
        );
    }
}

export default Dev1CardGrid;
