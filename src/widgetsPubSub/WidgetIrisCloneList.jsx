// 3rd party imports
import React from "react";
import PropTypes from "prop-types";
import PubSub from "pubsub-js";

// project imports
import DashboardDataCard from "../components/DashboardDataCard";
import apiProxy from "../api/apiProxy";

// Additional imports
var classNames = require("classnames");
var moment = require("moment");

// The purpose of this file is to create a React Component which can be included in HTML
// This is a self-contained class which knows how to get it's own data, and display it in HTML

// Create a React class component, everything below this is a class method (i.e. a function attached to the class)
class WidgetIrisCloneList extends React.PureComponent {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    constructor(props) {
        // This gets called when the widget is invoked

        // React constructor() requires us to call super()
        super(props);

        // Set our initial React state, this is the *only* time to bypass setState()
        this.state = { widgetName: "WidgetIrisCloneList", clonesByPath: {} };

        // This is out event handler, it's called from outside world via an event subscription, and when called, it
        // won't know about "this", so we need to bind our current "this" to "this" within the function
        this.getDataAndUpdateState = this.getDataAndUpdateState.bind(this);
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // eslint-disable-next-line no-unused-vars
    async getDataAndUpdateState(msg = "Default message", data = "Default data") {
        // this function gets the custom data for this widget, and updates our React component state
        // function is called manually once at componentDidMount, and then repeatedly via a PubSub event, which includes msg/data

        let clonesFromAll = [];

        let sources = ["jnjprodworker", "jnjtestk", "jnjqa2"];

        for (var source of sources) {
            console.log(source);
            // Retrieve our data from Prod (likely from an API)
            let response_clones = await apiProxy.get(`/sn/${source}.service-now.com/api/now/table/clone_instance`, {
                params: {
                    // Units for xAgoStart: years, months, days, hours, minutes
                    sysparm_query: "state=Completed^sys_created_on>=javascript:gs.monthsAgoStart(12)",
                    sysparm_display_value: "true",
                    sysparm_limit: 500
                }
            });

            console.log("response_clones", response_clones.data.result);
            // Loop through clone transactions, and make target_instance easier to find (by creating property for it)
            var clonesFromSource = response_clones.data.result.map(clone => {
                clone.path = `${source} -> ${clone.target_instance.display_value}`;
                clone.source = source;
                clone.target = clone.target_instance.display_value;
                return clone;
            });

            // Accumulate our results from this source
            clonesFromAll = clonesFromAll.concat(clonesFromSource);
            console.log(clonesFromAll);
        }

        console.log(clonesFromAll);

        // Function to group array of objects (rows) by a single user-defined field
        const groupBy = key => array =>
            array.reduce((objectsByKeyValue, obj) => {
                const value = obj[key];
                objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
                return objectsByKeyValue;
            }, {});
        // Create a function to group rows by the field "target_instance"
        const groupByClonePath = groupBy("path");

        // Loop through clone transaction, and group them by clone target (e.g. QA or Dev)
        // Produces object, where key is clone target (e.g. QA), and value is array of clone transactions
        var clonesByPath = groupByClonePath(clonesFromAll);

        console.log("clonesByPath", clonesByPath);

        // Given two clone transactions, return the latest (most recent) clone
        function latestClone(latest_clone, proposed_clone) {
            const answer_clone = moment(latest_clone.completed).isAfter(proposed_clone.completed) ? latest_clone : proposed_clone;
            return answer_clone;
        }

        // Loop through key(target_instance)/value(clonesList), find latest (most recent) clone, and create property pointing to it
        Object.entries(clonesByPath).map(([target_instance, clonesList]) => {
            console.log(clonesList);
            const latest_clone = clonesList.reduce(latestClone, { completed: "Jan 1, 1970" });
            latest_clone.daysAgo = moment().diff(latest_clone.completed, "days");
            console.log("daysAgo", latest_clone.daysAgo);
            clonesByPath[target_instance]["latest_clone"] = latest_clone;
        });

        // Update our own state with the new data
        this.setState({ clonesByPath: clonesByPath });
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

    renderAllTables() {
        if (this.state.clonesByPath === {}) {
            // Show a please message while we're waiting for data from the API call
            return <div className="waiting-for-data">Waiting for Data...</div>;
        } else {
            // OK, looks like we have incidents above the specified breach percentage, list them out
            console.log(this.state.clonesByPath);
            return (
                <div>
                    <table width="90%" style={{ marginBottom: "3vw" }}>
                        <thead>
                            <tr>
                                <th>Target</th>
                                <th>
                                    Days
                                    <br />
                                    Ago
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(this.state.clonesByPath)
                                .sort((a, b) => {
                                    // .entries() gives us an array of key/value for each object, so [1] is the value
                                    // We want to sort by the designated "latest_clone" variable in each object
                                    return moment(a[1].latest_clone.completed).isBefore(b[1].latest_clone.completed) ? 1 : -1;
                                })
                                .filter(
                                    ([key, value]) =>
                                        ![
                                            "jnjprodworker -> jnjtesti",
                                            "jnjprodworker -> jnjsandbox4",
                                            "jnjprodworker -> jnjdevk",
                                            "jnjprodworker -> jnjfusion"
                                        ].includes(key)
                                )
                                .map(([key, value]) => {
                                    console.log(key);
                                    // const latestCloneDate = value.latest_clone.completed;
                                    let daysAgoColor = value.latest_clone.daysAgo < 60 ? "cellGreen" : "cellAmber";
                                    let path = key.replace("jnjprodworker", "jnjprod");
                                    return (
                                        <tr key={key}>
                                            <td className="Font9x">{path}</td>
                                            <td className={classNames("Font9x", daysAgoColor)}>{value.latest_clone.daysAgo} days</td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
            );
        }
    }

    renderCardHeader() {
        return <div className="single-num-title">Iris Clones</div>;
    }

    renderCardBody() {
        return <div className="item">{this.renderAllTables()}</div>;
    }

    render() {
        // Standard React Lifecycle method, gets called by React itself
        // Get called every time the "state" object gets modified, in other words setState() was called
        // Also called if "props" are modified (which are passed from the parent)

        return (
            <DashboardDataCard id={this.props.id} position={this.props.position} color={this.props.color} widgetName="WidgetIrisCloneList">
                {this.renderCardHeader()}
                {this.renderCardBody()}
            </DashboardDataCard>
        );
    }
}

// -------------------------------------------------------------------------------------------------------
// We're outside the class now, just need to define a few additional things
// -------------------------------------------------------------------------------------------------------

// Set default props in case they aren't passed to us by the caller
WidgetIrisCloneList.defaultProps = {
    sla_threshhold_pct: 50
};

// Force the caller to include the proper attributes
WidgetIrisCloneList.propTypes = {
    sn_instance: PropTypes.string.isRequired,
    id: PropTypes.string,
    position: PropTypes.string.isRequired,
    color: PropTypes.string,
    sla_threshhold_pct: PropTypes.number.isRequired
};

// If we (this file) get "imported", this is what they'll be given
export default WidgetIrisCloneList;

// =======================================================================================================
// =======================================================================================================
