// 3rd party imports
import React from "react";
import PropTypes from "prop-types";

// Widget imports
import WidgetSNIrisReleaseNotes from "../widgetsPubSub/WidgetSNIrisReleaseNotes";

// Other project imports
import CardGrid from "../components/cardGrid";

class IrisReleaseNotesCardGrid extends React.Component {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    constructor(props) {
        super(props);
        props.changeParentPageTitle("Iris Release Notes");
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    render() {
        return (
            <div>
                <CardGrid rows="30" columns="12">
                    <WidgetSNIrisReleaseNotes position="span 8 / span 10" sn_instance={this.props.sn_instance} />
                </CardGrid>
            </div>
        );
    }
}

// -------------------------------------------------------------------------------------------------------
// We're outside the class now, just need to define a few additional things
// -------------------------------------------------------------------------------------------------------

// Set default props in case they aren't passed to us by the caller
IrisReleaseNotesCardGrid.defaultProps = {};

IrisReleaseNotesCardGrid.propTypes = {
    changeParentPageTitle: PropTypes.func.isRequired,
    sn_instance: PropTypes.string.isRequired
};

export default IrisReleaseNotesCardGrid;
// ====================================================================================
