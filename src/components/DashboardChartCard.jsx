import React from "react";

// Create a widget class --------
class DashboardChartCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = { widgetName: "firstwidget" };
        this.chartCardRef = React.createRef();

        // This is our event handler, it's called from the outside world via an event subscription, and when called, it
        // won't know about "this", so we need to bind our current "this" to "this" within the function
        this.triggerOurOwnResizeScrollEvent = this.triggerOurOwnResizeScrollEvent.bind(this);
    }

    triggerOurOwnResizeScrollEvent() {
        // The responsize resizing of the chartjs widget/card normally works fine, great in fact
        // The only time it doesn't is when the sidebar menu slides shut.  So in the "closeNav()" function,
        // I trigger a global window.resize event, and then listen for it, see the componentDidMount() below
        // Then I call this function to trigger a precise "scroll" event against the correct div, which causes chartjs to resizes
        // Why a "scroll" event ?  Who knows, discovered it was listening for "scroll" event by looking at Firefox devTools
        //
        // When we create this via React and react-chartjs-2:
        //
        // <div class="chartChart"
        //    <Bar data=barChartData />
        //
        // We will end up this this:
        //
        // <div class="chartCard"
        //    <div class="chartjs-size-monitor"
        //       <div class="chartjs-size-monitor-expand" />    <--- listens for "scroll" event to detect resize
        //       <div class="chartjs-sizes-monitor-shrink" />   <--- listens for "scroll" event to detect resize
        //    </div>
        //    <canvas />
        // </div>

        // Trigger a "scroll" event precisely where react-chartjs-2 is listening for it
        let chartjsSizeMonitorExpand = this.chartCardRef.current.childNodes[0].childNodes[0];
        chartjsSizeMonitorExpand.dispatchEvent(new Event("scroll"));
    }

    componentDidMount() {
        // When left navigation menu slides shut, we manually trigger a window.resize event.
        // Listen for that and trigger our own "scroll" event against the chart.js widget (so it re-sizes itself)
        window.addEventListener("resize", this.triggerOurOwnResizeScrollEvent);
    }

    componentWillUnmount() {
        // Before we get unmounted, remove the event listener for window resize (related to left nav menu)
        window.removeEventListener("resize", this.triggerOurOwnResizeScrollEvent);
    }

    render() {
        let styles = {};
        // If the caller passed in styles, use them
        if (this.props.position) {
            styles.gridArea = this.props.position;
        }
        if (this.props.color) {
            styles.backgroundColor = this.props.color;
        }

        return (
            <div className={"chartCard item"} id={this.props.id} style={styles} ref={this.chartCardRef}>
                {this.props.children}
            </div>
        );
    }
}

export default DashboardChartCard;
