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
import WidgetSNScrollableTable from "../widgets/WidgetSNScrollableTable";

import CardGrid from "../components/cardGrid";

class HomeCardGrid extends React.Component {
    constructor(props) {
        super(props);
        props.changeParentPageTitle("Home Dashboard");
    }

    componentDidMount() {}

    render() {
        return (
            <div>
                <CardGrid rows="10" columns="12">
                    <WidgetSNBarChart position="span 6 / span 6" instance={this.props.sn_instance} />
                    <WidgetSNScrollableTable position="span 4 / span 4" />

                    <WidgetSNINCP1P2Count position="span 2 / span 2" instance={this.props.sn_instance} />
                    <WidgetSNUniqueLoginsToday position="span 2 / span 2" instance={this.props.sn_instance} refreshInterval="10000" />
                    <WidgetSNCurrentUsers position="span 2/span 2" instance={this.props.sn_instance} />
                    <WidgetSNNewIncidentToday position="span 2/span 2" instance={this.props.sn_instance} />
                    <WidgetSNClicksByOS position="span 5/span 2" instance={this.props.sn_instance} />
                    <WidgetSNClicksByBrowser position="span 5/span 2" instance={this.props.sn_instance} />
                    <WidgetLeankitCount position="span 2/span 2" instance="jnj.leankit.com" />
                    <WidgetBoldChatActiveCount position="span 2/span 2" instance={this.props.boldchat_instance} />
                    <WidgetBoldChatInactiveCount position="span 2/span 2" instance={this.props.boldchat_instance} />
                </CardGrid>
            </div>
        );
    }
}

export default HomeCardGrid;
