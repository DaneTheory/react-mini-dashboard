import React from "react";
import WidgetSNINCP1P2Count from "../widgets/WidgetSNINCP1P2Count";
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
                    <WidgetSNINCP1P2Count color="#3a5174" position="1 / 3 / span 1 / span 2" id="2" instance={this.props.sn_instance} />
                </CardGrid>
            </div>
        );
    }
}

export default Dev1CardGrid;
