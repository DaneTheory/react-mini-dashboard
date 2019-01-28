// 3rd party imports
import React from "react";
import PropTypes from "prop-types";

// Widget imports
import WidgetSNINCP1P2Count from "../widgetsPubSub/WidgetSNINCP1P2Count";
import WidgetSNUniqueLoginsToday from "../widgetsPubSub/WidgetSNUniqueLoginsToday";
import WidgetSNCurrentUsers from "../widgetsPubSub/WidgetSNCurrentUsers";
import WidgetSNNewIncidentsToday from "../widgetsPubSub/WidgetSNNewIncidentsToday";
import WidgetSNClicksByOS from "../widgetsPubSub/WidgetSNClicksByOS";
import WidgetSNClicksByBrowser from "../widgetsPubSub/WidgetSNClicksByBrowser";
import WidgetBoldChatActiveCount from "../widgetsPubSub/WidgetBoldChatActiveCount";
import WidgetBoldChatInactiveCount from "../widgetsPubSub/WidgetBoldChatInactiveCount";
import WidgetLeankitCount from "../widgetsPubSub/WidgetLeankitCount";
import WidgetSNBarChart from "../widgetsPubSub/WidgetSNBarChart";
import WidgetSNScrollableTable from "../widgetsPubSub/WidgetSNScrollableTable";

// Other project imports
import CardGrid from "../components/cardGrid";

class HomeCardGrid extends React.Component {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    constructor(props) {
        super(props);

        // Update our parent (the Dashboard) with a new page title
        props.changeParentPageTitle("Home Dashboard");
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    render() {
        return (
            <div>
                <CardGrid rows="10" columns="12">
                    <WidgetSNBarChart position="span 6 / span 6" instance={this.props.sn_instance} />
                    <WidgetSNScrollableTable position="span 4 / span 4" />
                    <WidgetSNINCP1P2Count position="span 2 / span 2" instance={this.props.sn_instance} />
                    <WidgetSNUniqueLoginsToday position="span 2 / span 2" instance={this.props.sn_instance} />
                    <WidgetSNCurrentUsers position="span 2/span 2" instance={this.props.sn_instance} />
                    <WidgetSNNewIncidentsToday position="span 2/span 2" instance={this.props.sn_instance} />
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

// -------------------------------------------------------------------------------------------------------
// We're outside the class now, just need to define a few additional things
// -------------------------------------------------------------------------------------------------------

HomeCardGrid.propTypes = {
    changeParentPageTitle: PropTypes.func.isRequired,
    sn_instance: PropTypes.string.isRequired,
    boldchat_instance: PropTypes.string.isRequired
};

export default HomeCardGrid;
// ====================================================================================
