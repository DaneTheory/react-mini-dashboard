// 3rd party imports
import React from "react";
import PropTypes from "prop-types";

// Widget imports
import WidgetLeankitDiscoverySolutioningCardList from "../widgetsPubSub/WidgetLeankitDiscoverySolutioningCardList";
import WidgetIrisDevLinting from "../widgetsPubSub/WidgetIrisDevLinting";

// Other project imports
import CardGrid from "../components/cardGrid";

class Dev2CardGrid extends React.Component {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    constructor(props) {
        super(props);

        // Update our parent (the Dashboard) with a new page title
        props.changeParentPageTitle("Dev2 Dashboard");
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    render() {
        return (
            <CardGrid rows="20" row_height="3.5vw" columns="12" column_width="1fr">
                <WidgetLeankitDiscoverySolutioningCardList
                    position="span 4 / span 6"
                    leankit_instance={this.props.leankit_instance}
                    boardId={this.props.boardId}
                    daysBeforeBreachThreshold={10}
                />
                <WidgetIrisDevLinting
                    position="span 6 / span 6"
                    sn_instance={this.props.sn_instance}
                    redThreshold={95}
                    amberThreshold={97}
                />
            </CardGrid>
        );
    }
}

// -------------------------------------------------------------------------------------------------------
// We're outside the class now, just need to define a few additional things
// -------------------------------------------------------------------------------------------------------

Dev2CardGrid.propTypes = {
    sn_instance: PropTypes.string.isRequired,
    changeParentPageTitle: PropTypes.func.isRequired,
    boldchat_instance: PropTypes.string.isRequired,
    boardId: PropTypes.string.isRequired,
    leankit_instance: PropTypes.string.isRequired
};

// Set default props in case they aren't passed to us by the caller
Dev2CardGrid.defaultProps = { boardId: "412731036" };

export default Dev2CardGrid;

// ====================================================================================
