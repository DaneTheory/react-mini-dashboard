import React from "react";
import WidgetLeankitCardList from "../widgets/WidgetLeankitCardList";
import WidgetLeankitDiscoveryTotalCardCount from "../widgets/WidgetLeankitDiscoveryTotalCardCount";
import WidgetLeankitDiscoveryDefectCardCount from "../widgets/WidgetLeankitDiscoveryDefectCardCount";
import WidgetLeankitDiscoveryAvgCardAge from "../widgets/WidgetLeankitDiscoveryAvgCardAge";
import WidgetLeankitDiscoverySolutioningCardList from "../widgets/WidgetLeankitDiscoverySolutioningCardList";

import CardGrid from "../components/cardGrid";

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
                    <WidgetLeankitDiscoverySolutioningCardList
                        position="3 / 1 / span 10 / span 10"
                        instance={this.props.leankit_instance}
                        boardId="412731036"
                    />
                    <WidgetLeankitCardList position="span 10 / span 12" instance={this.props.leankit_instance} boardId="412731036" />
                </CardGrid>
            </div>
        );
    }
}

export default LeankitDiscoveryCardGrid;
