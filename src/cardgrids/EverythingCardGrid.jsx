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
import WidgetSNBarChart from "../widgetsPubSub/WidgetSNBarChart";
import WidgetBoldChatInactiveCount from "../widgetsPubSub/WidgetBoldChatInactiveCount";
import WidgetBoldChatActiveCount from "../widgetsPubSub/WidgetBoldChatActiveCount";

// Other project imports
import CardGrid from "../components/cardGrid";

class AllCardGrid extends React.Component {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    constructor(props) {
        super(props);
        props.changeParentPageTitle("Everything Dashboard");
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    render() {
        return (
            <div>
                <CardGrid rows="7" columns="6">
                    <WidgetSNINCP1P2Count position="span 2 / span 2" sn_instance={this.props.sn_instance} />
                    <WidgetSNUniqueLoginsToday position="span 2 / span 1" color="slategrey" sn_instance={this.props.sn_instance} />
                    <WidgetSNCurrentUsers position="span 2/span 1" color="darkgreen" sn_instance={this.props.sn_instance} />
                    <WidgetSNNewIncidentsToday position="span 2/span 2" color="orangered" sn_instance={this.props.sn_instance} />
                    <WidgetSNClicksByOS position="span 5/span 1" color="darkolivegreen" sn_instance={this.props.sn_instance} />
                    <WidgetSNClicksByBrowser position="span 5/span 1" color="darkolivegreen" sn_instance={this.props.sn_instance} />
                    <WidgetBoldChatActiveCount
                        position="span 2/span 1"
                        color="IndianRed"
                        boldchat_instance={this.props.boldchat_instance}
                    />
                    <WidgetBoldChatInactiveCount
                        position="span 2/span 1"
                        color="IndianRed"
                        boldchat_instance={this.props.boldchat_instance}
                    />
                    <WidgetSNBarChart position="span 5 / span 4" color="#ddd" sn_instance={this.props.sn_instance} />
                </CardGrid>
            </div>
        );
    }
}

// -------------------------------------------------------------------------------------------------------
// We're outside the class now, just need to define a few additional things
// -------------------------------------------------------------------------------------------------------

AllCardGrid.propTypes = {
    changeParentPageTitle: PropTypes.func.isRequired,
    sn_instance: PropTypes.string.isRequired,
    boldchat_instance: PropTypes.string.isRequired,
    leankit_instance: PropTypes.string.isRequired
};

export default AllCardGrid;

// ====================================================================================
