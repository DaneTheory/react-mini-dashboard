import React from "react";
import WidgetSNINCP1P2Count from "../widgets/WidgetSNINCP1P2Count";
import CardGrid from "../components/cardGrid";
import PropTypes from "prop-types";

class Demo1CardGrid extends React.Component {
    constructor(props) {
        super(props);
        props.changeParentPageTitle("Demo1 Dashboard");
    }

    componentDidMount() {}

    render() {
        return (
            <div>
                <CardGrid rows="7" columns="6">
                    <WidgetSNINCP1P2Count position="1 / 3 / span 2 / span 2" color="#3a5174" id="2" instance={this.props.sn_instance} />
                </CardGrid>
            </div>
        );
    }
}

Demo1CardGrid.propTypes = {
    changeParentPageTitle: PropTypes.string.isRequired,
    sn_instance: PropTypes.string.isRequired
};

export default Demo1CardGrid;
