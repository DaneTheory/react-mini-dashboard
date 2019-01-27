import React from "react";

// My own imports, namely Widgets
import WidgetSNINCP1P2Count from "../widgets/WidgetSNINCP1P2Count";
import WidgetSNUniqueLoginsToday from "../widgets/WidgetSNUniqueLoginsToday";
import WidgetSNCurrentUsers from "../widgets/WidgetSNCurrentUsers";
import WidgetSNNewIncidentToday from "../widgets/WidgetsSNNewIncidentsToday";
import WidgetSNClicksByOS from "../widgets/WidgetSNClicksByOS";
import WidgetSNClicksByBrowser from "../widgets/WidgetSNClicksByBrowser";
import WidgetBoldChatActiveCount from "../widgets/WidgetBoldChatActiveCount";
import WidgetBoldChatInactiveCount from "../widgets/WidgetBoldChatInactiveCount";
import WidgetLeankitCount from "../widgets/WidgetLeankitCount";
import WidgetSNBarChart from "../widgets/WidgetSNBarChart";
import PropTypes from "prop-types";

import CardGrid from "../components/cardGrid";

class AllCardGrid extends React.Component {
    constructor(props) {
        super(props);
        props.changeParentPageTitle("Everything Dashboard");
    }

    render() {
        return (
            <div>
                <CardGrid rows="7" columns="6">
                    <WidgetSNINCP1P2Count position="span 2 / span 2" instance={this.props.sn_instance} />
                    <WidgetSNUniqueLoginsToday position="span 2 / span 1" color="slategrey" instance={this.props.sn_instance} />
                    <WidgetSNCurrentUsers position="span 2/span 1" color="darkgreen" instance={this.props.sn_instance} />
                    <WidgetSNNewIncidentToday position="span 2/span 2" color="orangered" instance={this.props.sn_instance} />
                    <WidgetSNClicksByOS position="span 5/span 1" color="darkolivegreen" instance={this.props.sn_instance} />
                    <WidgetSNClicksByBrowser position="span 5/span 1" color="darkolivegreen" instance={this.props.sn_instance} />
                    <WidgetLeankitCount position="span 2/span 1" color="mediumpurple" instance="jnj.leankit.com" />
                    <WidgetBoldChatActiveCount position="span 2/span 1" color="IndianRed" instance={this.props.boldchat_instance} />
                    <WidgetBoldChatInactiveCount position="span 2/span 1" color="IndianRed" instance={this.props.boldchat_instance} />
                    <WidgetSNBarChart position="span 5 / span 4" color="#ddd" instance={this.props.sn_instance} />
                </CardGrid>
            </div>
        );
    }
}

AllCardGrid.propTypes = {
    changeParentPageTitle: PropTypes.func.isRequired,
    sn_instance: PropTypes.string.isRequired,
    boldchat_instance: PropTypes.string.isRequired
};

export default AllCardGrid;
