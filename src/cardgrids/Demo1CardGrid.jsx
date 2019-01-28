// 3rd party imports
import React from "react";
import PropTypes from "prop-types";

// Widget imports
import WidgetSNINCP1P2Count from "../widgetsPubSub/WidgetSNINCP1P2Count";

// Other project imports
import CardGrid from "../components/cardGrid";

class Demo1CardGrid extends React.Component {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    constructor(props) {
        super(props);

        // Update our parent (the Dashboard) with a new page title
        props.changeParentPageTitle("Demo1 Dashboard");
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    render() {
        return (
            <div>
                <CardGrid rows="7" columns="6">
                    <WidgetSNINCP1P2Count position="1 / 3 / span 2 / span 2" color="#3a5174" id="2" instance={this.props.sn_instance} />
                </CardGrid>
            </div>
        );
    }
}

// -------------------------------------------------------------------------------------------------------
// We're outside the class now, just need to define a few additional things
// -------------------------------------------------------------------------------------------------------

Demo1CardGrid.propTypes = {
    changeParentPageTitle: PropTypes.func.isRequired,
    sn_instance: PropTypes.string.isRequired
};

export default Demo1CardGrid;

// ====================================================================================
