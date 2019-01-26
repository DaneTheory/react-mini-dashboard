import React from "react";
import WidgetSNBarChart from "../widgets/WidgetSNBarChart";
import WidgetSNScrollableTable from "../widgets/WidgetSNScrollableTable";
import WidgetSNUniqueLoginsToday from "../widgets/WidgetSNUniqueLoginsToday";
import WidgetSNExperiment01 from "../widgets/WidgetSNExperiment01";
import PubSub from "pubsub-js";

import CardGrid from "../components/cardGrid";

class Dev1CardGrid extends React.Component {
    constructor(props) {
        super(props);
        props.changeParentPageTitle("Dev1 Dashboard");
        this.child = React.createRef();
    }

    widgetEventUpdateLoop(timemoutInMs) {
        PubSub.publish("updateWidgetsEvent", "Update your data, you widgets !");

        setTimeout(() => {
            this.widgetEventUpdateLoop(timemoutInMs);
        }, timemoutInMs);
    }

    componentDidMount() {
        // Call our ref to trigger an experimental update
        // NOTE: Because we're using ReactTimeout package, we need to add "wrappedIntance"
        this.child.current.wrappedInstance.updateTrigger();

        // Create a PubSub event loop
        this.widgetEventUpdateLoop(5000);
    }

    render() {
        return (
            <div>
                <CardGrid rows="10" columns="12">
                    <WidgetSNBarChart color="#ddd" position="span 5 / span 4" instance={this.props.sn_instance} />
                    <WidgetSNScrollableTable position="span 4 / span 4" />
                    <WidgetSNUniqueLoginsToday position="span 2 / span 2" instance={this.props.sn_instance} interval="20" />
                    <WidgetSNExperiment01 ref={this.child} position="span 2 / span 3" instance={this.props.sn_instance} />
                </CardGrid>
            </div>
        );
    }
}

export default Dev1CardGrid;
