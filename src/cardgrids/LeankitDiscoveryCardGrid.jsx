// 3rd party imports
import React from "react";
import PropTypes from "prop-types";

// Widget imports
import WidgetLeankitDiscoveryCardList from "../widgetsPubSub/WidgetLeankitDiscoveryCardList";
import WidgetLeankitDiscoveryTotalCardCount from "../widgetsPubSub/WidgetLeankitDiscoveryTotalCardCount";
import WidgetLeankitDiscoveryDefectCardCount from "../widgetsPubSub/WidgetLeankitDiscoveryDefectCardCount";
import WidgetLeankitDiscoveryAvgCardAge from "../widgetsPubSub/WidgetLeankitDiscoveryAvgCardAge";
import WidgetLeankitDiscoverySolutioningCardNearingBreachList from "../widgetsPubSub/WidgetLeankitDiscoverySolutioningCardNearingBreachList";
import WidgetLeankitDiscoveryOwnerList from "../widgetsPubSub/WidgetLeankitDiscoveryOwnerList";

// Other project imports
import CardGrid from "../components/cardGrid";

class LeankitDiscoveryCardGrid extends React.PureComponent {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    constructor(props) {
        super(props);
        props.changeParentPageTitle("Leankit Discovery Dashboard");
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    render() {
        return (
            <div>
                <CardGrid rows="30" columns="12">
                    <WidgetLeankitDiscoveryTotalCardCount
                        position="1 / 1 / span 2 / span 2"
                        leankit_instance={this.props.leankit_instance}
                        boardId={this.props.boardId}
                    />
                    <WidgetLeankitDiscoveryDefectCardCount
                        position="3 / 1 / span 2 / span 2"
                        leankit_instance={this.props.leankit_instance}
                        boardId={this.props.boardId}
                    />
                    <WidgetLeankitDiscoveryAvgCardAge
                        position="1 / 3 / span 2 / span 2"
                        leankit_instance={this.props.leankit_instance}
                        boardId={this.props.boardId}
                    />
                    <WidgetLeankitDiscoveryOwnerList
                        position="1 / 5 / span 4 / span 2"
                        leankit_instance={this.props.leankit_instance}
                        boardId={this.props.boardId}
                    />
                    <WidgetLeankitDiscoverySolutioningCardNearingBreachList
                        position="1 / 7 / span 6 / span 6"
                        leankit_instance={this.props.leankit_instance}
                        boardId={this.props.boardId}
                        showCardsWithThisManyDaysRemaining={5}
                    />
                    <WidgetLeankitDiscoveryCardList
                        position="span 10 / span 12"
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

// Set default props in case they aren't passed to us by the caller
LeankitDiscoveryCardGrid.defaultProps = {
    boardId: "412731036"
};

LeankitDiscoveryCardGrid.propTypes = {
    changeParentPageTitle: PropTypes.func.isRequired,
    leankit_instance: PropTypes.string.isRequired,
    boardId: PropTypes.string.isRequired
};

export default LeankitDiscoveryCardGrid;
// ====================================================================================
