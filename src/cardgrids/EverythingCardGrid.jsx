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
import WidgetSNBarChart from "../widgetsExperimental/WidgetChartJSBarChart";
import WidgetBoldChatInactiveCount from "../widgetsPubSub/WidgetBoldChatInactiveCount";
import WidgetBoldChatActiveCount from "../widgetsPubSub/WidgetBoldChatActiveCount";
import WidgetLeankitDeliveryRemainingPoints from "../widgetsPubSub/WidgetLeankitDeliveryRemainingPoints";

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
                <CardGrid rows="12" row_height="3.5vw" columns="12" column_width="1fr">
                    <WidgetSNINCP1P2Count position="span 2 / span 2" sn_instance={this.props.sn_instance} />
                    <WidgetSNUniqueLoginsToday position="span 2 / span 2" color="slategrey" sn_instance={this.props.sn_instance} />
                    <WidgetSNCurrentUsers position="span 2/span 2" color="darkgreen" sn_instance={this.props.sn_instance} />
                    <WidgetSNNewIncidentsToday position="span 2/span 2" color="orangered" sn_instance={this.props.sn_instance} />
                    <WidgetSNClicksByOS position="span 4/span 2" color="darkolivegreen" sn_instance={this.props.sn_instance} />
                    <WidgetSNClicksByBrowser position="span 4/span 2" color="darkolivegreen" sn_instance={this.props.sn_instance} />
                    <WidgetBoldChatActiveCount
                        position="span 2/span 2"
                        color="IndianRed"
                        boldchat_instance={this.props.boldchat_instance}
                    />
                    <WidgetBoldChatInactiveCount
                        position="span 2/span 2"
                        color="IndianRed"
                        boldchat_instance={this.props.boldchat_instance}
                    />
                    <WidgetSNBarChart position="span 5 / span 4" color="#ddd" sn_instance={this.props.sn_instance} />
                    <WidgetLeankitDeliveryRemainingPoints
                        position="span 2 / span 2"
                        leankit_instance={this.props.leankit_instance}
                        boardId={this.props.boardId}
                    />
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
    leankit_instance: PropTypes.string.isRequired,
    boardId: PropTypes.string.isRequired
};

// Set default props in case they aren't passed to us by the caller
AllCardGrid.defaultProps = {
    boardId: "412731036"
};
export default AllCardGrid;

// ====================================================================================
