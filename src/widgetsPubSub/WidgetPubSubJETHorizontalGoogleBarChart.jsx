// 3rd party imports
import React from "react";
import PropTypes from "prop-types";
import PubSub from "pubsub-js";
import { Chart } from "react-google-charts";
import DashboardDataCard from "../components/DashboardDataCard";
import DashboardGoogleChartCard from "../components/DashboardGoogleChartCard";
import { ThemeConsumer } from "../components/ThemeContext";

// project imports
import { getJETData } from "../utilities/getJETData";

// The purpose of this file is to create a React Component which can be included in HTML
// This is a self-contained class which knows how to get it's own data, and display it in HTML

// Create a React class component, everything below this is a class method (i.e. a function attached to the class)
class WidgetPubSubJETHorizontalGoogleBarChart extends React.Component {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    constructor(props) {
        // This gets called when the widget is invoked

        // React constructor() requires us to call super()
        super(props);

        // Set our initial React state, this is the *only* time to bypass setState()
        this.state = {
            widgetName: "WidgetPubSubJETHorizontalGoogleBarChart",
            chartData: null
        };

        // This is out event handler, it's called from outside world via an event subscription, and when called, it
        // won't know about "this", so we need to bind our current "this" to "this" within the function
        this.getDataAndUpdateState = this.getDataAndUpdateState.bind(this);
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // eslint-disable-next-line no-unused-vars
    async getDataAndUpdateState(msg = "Default message", data = "Default data") {
        // this function gets the custom data for this widget, and updates our React component state
        // function is called manually once at componentDidMount, and then repeatedly via a PubSub event, which includes msg/data

        let JETconsumptionUnits = await getJETData(this.props.sn_instance, this.props.boldchat_instance);

        // Create an array of values for use in the chart data
        let chartData = [["Name", "Pct of Target"]];
        Object.values(JETconsumptionUnits).forEach(JETconsumptionUnit => {
            chartData.push([JETconsumptionUnit.name, JETconsumptionUnit.pctOfTarget]);
        });

        // Update our own state with the new data
        this.setState({ chartData: chartData });
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    componentDidMount = async () => {
        // Standard React Lifecycle method, gets called by React itself
        // React calls this once after component gets "mounted", in other words called *after* the render() method below

        // manual update of our own data
        this.getDataAndUpdateState();

        // Now listen for update requests by subscribing to update events
        PubSub.subscribe("updateWidgetsEvent", this.getDataAndUpdateState);
    };

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    componentWillUnmount() {
        // Standard React Lifecycle method, gets called by React itself
        // Gets called once before React unmounts and destroys our component

        // Unsubscribe from all pubsub events
        PubSub.unsubscribe(this.getDataAndUpdateState);
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    render() {
        // Standard React Lifecycle method, gets called by React itself
        // Get called every time the "state" object gets modified, in other words setState() was called
        // Also called if "props" are modified (which are passed from the parent)

        let styles = {};
        // If the caller passed in styles, use them
        if (this.props.position) {
            styles.gridArea = this.props.position;
        }
        if (this.props.color) {
            styles.backgroundColor = this.props.color;
        }

        console.log("chartData", this.state.chartData);

        if (!this.state.chartData) {
            return (
                <DashboardDataCard id={this.props.id} position={this.props.position} color={this.props.color} widgetName="Loading data">
                    <div>Loading Data...</div>
                </DashboardDataCard>
            );
        } else {
            // We've got data, so load the chart now
            return (
                <ThemeConsumer>
                    {/* Use a render prop to get the global value from the Context API Consumer */}
                    {theme => (
                        <DashboardGoogleChartCard
                            id={this.props.id}
                            position={this.props.position}
                            color={this.props.color}
                            widgetName="WidgetSNBarChart"
                        >
                            <div className="single-num-title">JET Consumption vs Target</div>

                            {/* Use this div to size the chart, rather than using Chart Width/Height */}
                            {/* Chart width/height seems to create two nested divs, which each have the %size applied, so double affect */}
                            <div className="manualChartSize" style={{ width: "95%", height: "95%" }}>
                                <Chart
                                    width={"100%"}
                                    height={"100%"}
                                    chartType="BarChart"
                                    loader={<div>Loading Chart</div>}
                                    data={this.state.chartData}
                                    options={{
                                        titleTextStyle: {
                                            color: theme.currentColorTheme.colorThemeCardFont
                                        },
                                        backgroundColor: theme.currentColorTheme.colorThemeCardBackground,
                                        chartArea: {
                                            left: "30%",
                                            right: 0,
                                            top: "5%",
                                            bottom: "15%",
                                            backgroundColor: {
                                                fill: theme.currentColorTheme.colorThemeCardBackground
                                            }
                                        },
                                        hAxis: {
                                            gridlines: {
                                                count: 6
                                            },
                                            textStyle: {
                                                color: theme.currentColorTheme.colorThemeCardFont
                                            },
                                            format: "percent",
                                            viewWindow: {
                                                min: 0
                                            }
                                        },
                                        vAxis: {
                                            textStyle: {
                                                color: theme.currentColorTheme.colorThemeCardFont
                                            }
                                        },
                                        animation: {
                                            duration: 1000,
                                            easing: "out",
                                            startup: true
                                        },
                                        colors: ["green"]
                                    }}
                                />
                            </div>
                        </DashboardGoogleChartCard>
                    )}
                </ThemeConsumer>
            );
        }
    }
}

// -------------------------------------------------------------------------------------------------------
// We're outside the class now, just need to define a few additional things
// -------------------------------------------------------------------------------------------------------

// Set default props in case they aren't passed to us by the caller
WidgetPubSubJETHorizontalGoogleBarChart.defaultProps = {};

// Force the caller to include the proper attributes
WidgetPubSubJETHorizontalGoogleBarChart.propTypes = {
    sn_instance: PropTypes.string.isRequired,
    boldchat_instance: PropTypes.string.isRequired,
    id: PropTypes.string,
    position: PropTypes.string.isRequired,
    color: PropTypes.string
};

// If we (this file) get "imported", this is what they'll be given
export default WidgetPubSubJETHorizontalGoogleBarChart;

// =======================================================================================================
// =======================================================================================================
