// 3rd party imports
import React from "react";
import PropTypes from "prop-types";
import PubSub from "pubsub-js";
import { Chart } from "react-google-charts";
import DashboardGoogleChartCard from "../components/DashboardGoogleChartCard";
import { ThemeConsumer } from "../components/ThemeContext";

// project imports
import apiProxy from "../api/apiProxy";

// The purpose of this file is to create a React Component which can be included in HTML
// This is a self-contained class which knows how to get it's own data, and display it in HTML

// Create a React class component, everything below this is a class method (i.e. a function attached to the class)
class WidgetGoogleChartHorizontalBar extends React.Component {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    constructor(props) {
        // This gets called when the widget is invoked

        // React constructor() requires us to call super()
        super(props);

        // Set our initial React state, this is the *only* time to bypass setState()
        this.state = {
            widgetName: "WidgetGoogleChartHorizontalBar",
            count: null,
            rowData: [[8, 12], [4, 5.5], [11, 14], [4, 5], [3, 3.5], [6.5, 7]]
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

        // Retrieve our data (likely from an API)
        const response = await apiProxy.get(`/sn/${this.props.sn_instance}/api/now/stats/sys_user_presence`, {
            params: {
                // Units: years, months, days, hours, minutes
                sysparm_query: "sys_updated_on>=javascript:gs.daysAgoStart(0)",
                sysparm_count: "true",
                sysparm_display_value: "true"
            }
        });

        // Update our own component state with the new data, which will cause our component to re-render
        this.setState({ count: response.data.result.stats.count });
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    componentDidMount = async () => {
        // Standard React Lifecycle method, gets called by React itself
        // React calls this once after component gets "mounted", in other words called *after* the render() method below

        // manual update of our own data
        this.getDataAndUpdateState();

        // Now listen for update requests by subscribing to update events
        PubSub.subscribe("updateWidgetsEvent", this.getDataAndUpdateState);

        setTimeout(() => {
            // Update our own component state with the new data, which will cause our component to re-render
            this.setState({ rowData: [[8, 5], [4, 5.5], [11, 14], [4, 5], [3, 3.5], [6.5, 7]] });
        }, 3000);
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
                        {/* Use this div to size the chart, rather than using Chart Width/Height */}
                        {/* Chart width/height seems to create two nested divs, which each have the %size applied, so double affect */}
                        <div className="manualChartSize" style={{ width: "95%", height: "95%" }}>
                            <Chart
                                width={"100%"}
                                height={"100%"}
                                chartType="BarChart"
                                loader={<div>Loading Chart</div>}
                                data={[
                                    ["Year", "Sales", "Expenses", "Profit"],
                                    ["2014", 1000, 400, 200],
                                    ["2015", 1170, 460, 250],
                                    ["2016", 660, 1120, 300],
                                    ["2017", 1030, 540, 350]
                                ]}
                                options={{
                                    title: "Horizontal Bar Chart Title",
                                    titleTextStyle: {
                                        color: theme.currentColorTheme.colorThemeCardFontDefault
                                    },
                                    backgroundColor: theme.currentColorTheme.colorThemeCardBackground,
                                    // backgroundColor: "#2b2d3e",
                                    chartArea: {
                                        width: "90%",
                                        height: "70%",
                                        backgroundColor: {
                                            fill: theme.currentColorTheme.colorThemeCardBackground
                                        }
                                    },
                                    hAxis: {
                                        gridlines: {
                                            count: 6
                                        },
                                        textStyle: {
                                            color: theme.currentColorTheme.colorThemeCardFontDefault
                                        }
                                    },
                                    vAxis: {
                                        textStyle: {
                                            color: theme.currentColorTheme.colorThemeCardFontDefault
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

// -------------------------------------------------------------------------------------------------------
// We're outside the class now, just need to define a few additional things
// -------------------------------------------------------------------------------------------------------

// Set default props in case they aren't passed to us by the caller
WidgetGoogleChartHorizontalBar.defaultProps = {};

// Force the caller to include the proper attributes
WidgetGoogleChartHorizontalBar.propTypes = {
    sn_instance: PropTypes.string.isRequired,
    id: PropTypes.string,
    position: PropTypes.string.isRequired,
    color: PropTypes.string
};

// If we (this file) get "imported", this is what they'll be given
export default WidgetGoogleChartHorizontalBar;

// =======================================================================================================
// =======================================================================================================
