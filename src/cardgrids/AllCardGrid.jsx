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
                    <WidgetSNINCP1P2Count color="#3a5174" position="span 1 / span 2" instance={this.props.sn_instance} />
                    <WidgetSNUniqueLoginsToday color="slategrey" instance={this.props.sn_instance} />
                    <WidgetSNCurrentUsers color="darkgreen" instance={this.props.sn_instance} />
                    <WidgetSNNewIncidentToday color="orangered" position="span 1/span 1" instance={this.props.sn_instance} />
                    <WidgetSNClicksByOS color="darkolivegreen" position="span 3/span 1" instance={this.props.sn_instance} />
                    <WidgetSNClicksByBrowser color="darkolivegreen" position="span 3/span 1" instance={this.props.sn_instance} />
                    <WidgetLeankitCount color="mediumpurple" position="span 1/span 1" instance="jnj.leankit.com" />
                    <WidgetBoldChatActiveCount color="IndianRed" position="span 1/span 1" instance={this.props.boldchat_instance} />
                    <WidgetBoldChatInactiveCount color="IndianRed" position="span 1/span 1" instance={this.props.boldchat_instance} />
                    <WidgetSNBarChart color="#ddd" position="span 3 / span 4" instance={this.props.sn_instance} />
                </CardGrid>
            </div>
        );
    }
}

export default AllCardGrid;
