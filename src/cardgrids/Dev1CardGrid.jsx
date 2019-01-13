import React from "react";
import WidgetSNBarChart from "../widgets/WidgetSNBarChart";

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
                <CardGrid rows="7" columns="6">
                    <WidgetSNBarChart color="#ddd" position="span 5 / span 5" instance={this.props.sn_instance} />
                </CardGrid>
            </div>
        );
    }
}

export default Dev1CardGrid;
