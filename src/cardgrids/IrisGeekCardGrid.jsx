// 3rd party imports
import React from "react";
import PropTypes from "prop-types";

// Widget imports
import WidgetLeankitDiscoveryCardList from "../widgetsPubSub/WidgetLeankitDiscoveryCardList";
import WidgetIrisWorkUnitListStale from "../widgetsPubSub/WidgetIrisWorkUnitListStale";

// Other project imports
import CardGrid from "../components/cardGrid";

class IrisGeekCardGrid extends React.PureComponent {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    constructor(props) {
        super(props);

        // Update our parent (the Dashboard) with a new page title
        props.changeParentPageTitle("Iris Geek Dashboard");
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    render() {
        // console.log("Demo1CardGrid: render()");
        return (
            <CardGrid rows="12" row_height="3.5vw" columns="12" column_width="1fr">
                <WidgetLeankitDiscoveryCardList
                    position="span 10 / span 6"
                    leankit_instance={this.props.leankit_instance}
                    boardId={this.props.boardId}
                />
                <WidgetIrisWorkUnitListStale position="span 8 / span 6" sn_instance={this.props.sn_instance} />
            </CardGrid>
        );
    }
}

// -------------------------------------------------------------------------------------------------------
// We're outside the class now, just need to define a few additional things
// -------------------------------------------------------------------------------------------------------

IrisGeekCardGrid.propTypes = {
    sn_instance: PropTypes.string.isRequired,
    changeParentPageTitle: PropTypes.func.isRequired,
    boardId: PropTypes.string.isRequired,
    leankit_instance: PropTypes.string.isRequired,
    boldchat_instance: PropTypes.string.isRequired
};

// Set default props in case they aren't passed to us by the caller
IrisGeekCardGrid.defaultProps = {
    boardId: "412731036"
};

export default IrisGeekCardGrid;

// ====================================================================================
