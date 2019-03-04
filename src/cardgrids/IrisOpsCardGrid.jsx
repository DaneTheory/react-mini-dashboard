// 3rd party imports
import React from "react";
import PropTypes from "prop-types";

// Widget imports
import WidgetIrisINCBreachList from "../widgetsPubSub/WidgetIrisINCBreachList";

// Other project imports
import CardGrid from "../components/cardGrid";

class IrisOpsCardGrid extends React.Component {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    constructor(props) {
        super(props);

        // Update our parent (the Dashboard) with a new page title
        props.changeParentPageTitle("Iris Ops Dashboard");
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    render() {
        // console.log("Demo1CardGrid: render()");
        return (
            <CardGrid rows="12" row_height="3.5vw" columns="12" column_width="1fr">
                <WidgetIrisINCBreachList position="span 12 / span 6" sn_instance={this.props.sn_instance} />
            </CardGrid>
        );
    }
}

// -------------------------------------------------------------------------------------------------------
// We're outside the class now, just need to define a few additional things
// -------------------------------------------------------------------------------------------------------

IrisOpsCardGrid.propTypes = {
    sn_instance: PropTypes.string.isRequired,
    changeParentPageTitle: PropTypes.func.isRequired
};

// Set default props in case they aren't passed to us by the caller
IrisOpsCardGrid.defaultProps = {};

export default IrisOpsCardGrid;

// ====================================================================================
