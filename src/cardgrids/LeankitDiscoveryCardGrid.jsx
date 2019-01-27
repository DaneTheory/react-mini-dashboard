// 3rd party imports
import React from "react";
import PropTypes from "prop-types";

// project imports
import CardGrid from "../components/cardGrid";
import WidgetLeankitCardList from "../widgetsPubSub/WidgetLeankitCardList";
import WidgetLeankitDiscoveryTotalCardCount from "../widgetsPubSub/WidgetLeankitDiscoveryTotalCardCount";
import WidgetLeankitDiscoveryDefectCardCount from "../widgetsPubSub/WidgetLeankitDiscoveryDefectCardCount";
import WidgetLeankitDiscoveryAvgCardAge from "../widgetsPubSub/WidgetLeankitDiscoveryAvgCardAge";
import WidgetLeankitDiscoverySolutioningCardList from "../widgetsPubSub/WidgetLeankitDiscoverySolutioningCardList";
import WidgetLeankitDiscoveryOwnerList from "../widgetsPubSub/WidgetLeankitDiscoveryOwnerList";

class LeankitDiscoveryCardGrid extends React.Component {
    constructor(props) {
        super(props);
        props.changeParentPageTitle("Leankit Discovery Dashboard");
    }

    componentDidMount() {}

    render() {
        return (
            <div>
                <CardGrid rows="30" columns="12">
                    <WidgetLeankitDiscoveryTotalCardCount
                        position="1 / 1 / span 2 / span 2"
                        instance={this.props.leankit_instance}
                        boardId="412731036"
                    />
                    <WidgetLeankitDiscoveryDefectCardCount
                        position="1 / 3 / span 2 / span 2"
                        instance={this.props.leankit_instance}
                        boardId="412731036"
                    />
                    <WidgetLeankitDiscoveryAvgCardAge
                        position="1 / 5 / span 2 / span 2"
                        instance={this.props.leankit_instance}
                        boardId="412731036"
                    />
                    <WidgetLeankitDiscoveryOwnerList
                        position="1 / 7 / span 4 / span 2"
                        instance={this.props.leankit_instance}
                        boardId="412731036"
                    />
                    <WidgetLeankitDiscoverySolutioningCardList
                        position="5 / 1 / span 10 / span 8"
                        instance={this.props.leankit_instance}
                        boardId="412731036"
                    />
                    <WidgetLeankitCardList position="span 10 / span 8" instance={this.props.leankit_instance} boardId="412731036" />
                </CardGrid>
            </div>
        );
    }
}

LeankitDiscoveryCardGrid.propTypes = {
    changeParentPageTitle: PropTypes.func.isRequired,
    leankit_instance: PropTypes.string.isRequired
};

export default LeankitDiscoveryCardGrid;
