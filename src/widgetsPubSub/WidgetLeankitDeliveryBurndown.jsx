// 3rd party imports
import React from "react";
import PropTypes from "prop-types";
import PubSub from "pubsub-js";
import { Chart } from "react-google-charts";
import DashboardDataCard from "../components/DashboardDataCard";
import DashboardGoogleChartCard from "../components/DashboardGoogleChartCard";
import { ThemeConsumer } from "../components/ThemeContext";

// project imports
import { getLeankitCards } from "../utilities/getLeankitCards";
import { createLeankitDataObject } from "../utilities/createLeankitDataObject";

// The purpose of this file is to create a React Component which can be included in HTML
// This is a self-contained class which knows how to get it's own data, and display it in HTML

// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------

// Create a React class component, everything below this is a class method (i.e. a function attached to the class)
class WidgetLeankitDeliveryBurndown extends React.Component {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    constructor(props) {
        // This gets called when the widget is invoked

        // React constructor() requires us to call super()
        super(props);

        // Set our initial React state, this is the *only* time to bypass setState()
        this.state = {
            widgetName: "WidgetLeankitDeliveryBurndown",
            chartData: {},
            leankitDataObject: { listCards: {} }
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

        // Create an array of values for use in the chart data
        // let chartData = {
        //     pointsPerDay: [
        //         [
        //             "date",
        //             "Planned Points",
        //             { type: "string", role: "style" },
        //             "Unplanned Points",
        //             "burndownLinePerDay",
        //             { type: "string", role: "style" }
        //         ],
        //         ["2/13/2019", 100, null, 0, 100, null],
        //         ["2/14/2019", 100, null, 5, 90, null],
        //         ["2/15/2019", 90, "point { size: 18; shape-type: star; fill-color: #fff; }", 5, 80, null],
        //         ["2/17/2019", 60, null, 10, 70, null],
        //         ["2/18/2019", 60, null, 5, 70, null],
        //         ["2/19/2019", 60, null, 0, 60, null]
        //     ]
        // };

        // Update our own state with the new data
        // this.setState({ chartData: chartData });

        // this function gets the custom data for this widget, and updates our React component state
        // function is called manually once at componentDidMount, and then repeatedly via a PubSub event, which includes msg/data

        // Retrieve our data (likely from an API)
        // Get all the leankit cards
        let leankit_cards = await getLeankitCards(this.props.leankit_instance, this.props.boardId, "active,backlog");

        // Save these cards to our state, which triggers react to render an update to the screen
        this.setState({ leankit_cards: leankit_cards });

        let leankitDataObject = createLeankitDataObject(leankit_cards, this.props.boardId);

        let labels = leankitDataObject.burndownChart.labels;
        let series1 = leankitDataObject.burndownChart.data[0];
        let series2 = leankitDataObject.burndownChart.data[1];
        let series3 = leankitDataObject.burndownChart.data[2];

        // Create initial chart data with one column
        let chartData = labels.map(label => {
            return [label];
        });

        function addColumn(dataArray, columnArray) {
            dataArray = dataArray.map((dataElement, index) => {
                dataElement.push(columnArray[index]);
                return dataElement;
            });
            return dataArray;
        }

        chartData = addColumn(chartData, series1);
        chartData = addColumn(chartData, series2);
        chartData = addColumn(chartData, series3);
        chartData.unshift(["Date", "Planned", "Burndown", "Unplanned"]);

        this.setState({
            chartData: chartData
        });
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
                            <div className="single-num-title">Iris Development Burndown</div>

                            {/* Use this div to size the chart, rather than using Chart Width/Height */}
                            {/* Chart width/height seems to create two nested divs, which each have the %size applied, so double affect */}
                            <div className="manualChartSize" style={{ width: "95%", height: "95%" }}>
                                <Chart
                                    width={"100%"}
                                    height={"100%"}
                                    chartType="LineChart"
                                    loader={<div>Loading Chart</div>}
                                    data={this.state.chartData}
                                    options={{
                                        titleTextStyle: {
                                            color: theme.currentColorTheme.colorThemeCardFontDefault
                                        },
                                        backgroundColor: theme.currentColorTheme.colorThemeCardBackground,
                                        chartArea: {
                                            left: "4%",
                                            right: 0,
                                            top: "5%",
                                            bottom: "10%",
                                            backgroundColor: {
                                                fill: theme.currentColorTheme.colorThemeCardBackground
                                            }
                                        },
                                        hAxis: {
                                            textStyle: {
                                                color: theme.currentColorTheme.colorThemeCardFontDefault,
                                                fontSize: 10
                                            }
                                        },
                                        vAxis: {
                                            textStyle: {
                                                color: theme.currentColorTheme.colorThemeCardFontDefault
                                            },
                                            // maxValue: 125,
                                            minValue: 0,
                                            viewWindow: {
                                                min: 0
                                            },
                                            gridlines: {
                                                color: theme.currentColorTheme.colorThemeCardFontDefault,
                                                count: 10
                                            }
                                        },
                                        series: {
                                            // Planned Pts
                                            0: {
                                                curveType: "function",
                                                pointSize: 5,
                                                color: theme.currentColorTheme.colorThemeChartBrown,
                                                lineWidth: 2
                                            },
                                            // Burndown (Ideal)
                                            1: {
                                                pointSize: 2,
                                                color: theme.currentColorTheme.colorThemeChartGreen,
                                                lineWidth: 3
                                            },
                                            // Unplanned Pts
                                            2: {
                                                curveType: "function",
                                                pointSize: 2,
                                                color: theme.currentColorTheme.colorThemeChartPurple,
                                                lineWidth: 1
                                            }
                                        },
                                        animation: {
                                            duration: 1000,
                                            easing: "out",
                                            startup: true
                                        }
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
WidgetLeankitDeliveryBurndown.defaultProps = {};

// Force the caller to include the proper attributes
WidgetLeankitDeliveryBurndown.propTypes = {
    leankit_instance: PropTypes.string.isRequired,
    id: PropTypes.string,
    position: PropTypes.string.isRequired,
    color: PropTypes.string,
    boardId: PropTypes.string.isRequired
};

// If we (this file) get "imported", this is what they'll be given
export default WidgetLeankitDeliveryBurndown;

// =======================================================================================================
// =======================================================================================================
