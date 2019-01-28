// 3rd party imports
import React from "react";
import { HashRouter, Route, Link } from "react-router-dom";
import PubSub from "pubsub-js";
import PropTypes from "prop-types";

// project imports
import Demo1CardGrid from "../cardgrids/Demo1CardGrid";
import EverythingCardGrid from "../cardgrids/EverythingCardGrid";
import Dev1CardGrid from "../cardgrids/Dev1CardGrid";
import LeankitDiscoveryCardGrid from "../cardgrids/LeankitDiscoveryCardGrid";
import HomeCardGrid from "../cardgrids/HomeCardGrid";

class Dashboard extends React.Component {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    constructor(props) {
        super(props);

        this.state = {
            pageTitle: "Original Title",
            sn_instance: "jnjprodworker.service-now.com",
            leankit_instance: "jnj.leankit.com",
            // sn_instance: "jnjsandbox.service-now.com",
            boldchat_instance: "api.boldchat.com",
            // time remaining until next data refresh PubSub
            refreshRemainingMs: props.refreshInterval
        };

        // So we can keep track of the once-per-second timeout
        this.intervalHandle = null;

        this.sidebarRef = React.createRef();
        this.mainRef = React.createRef();
        // This is our event handler, it's called from the outside world via an event subscription, and when called, it
        // won't know about "this", so we need to bind our current "this" to "this" within the function
        this.openNav = this.openNav.bind(this);
        this.closeNav = this.closeNav.bind(this);
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    widgetRefreshCountdownLoop() {
        // console.log("Time left: " + this.state.refreshRemainingMs);

        // Check to see if timer expired, if so trigger data update
        if (this.state.refreshRemainingMs <= 0) {
            PubSub.publish("updateWidgetsEvent", "Update your data, you widgets !");
            this.setState({ refreshRemainingMs: this.props.refreshInterval });
        }

        // Subtract one second, and then wait for one second
        this.setState({ refreshRemainingMs: this.state.refreshRemainingMs - this.props.refreshUpdateInterval });
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    componentDidMount() {
        // Create a interval to periodically trigger PubSub event
        this.intervalHandle = setInterval(() => {
            this.widgetRefreshCountdownLoop();
        }, this.props.refreshUpdateInterval);
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // Later will pass this function to child components so they can change our Page Title
    changePageTitle(newTitle) {
        this.setState({ pageTitle: newTitle });
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    /* Set the width of the side navigation to 250px */
    openNav() {
        // To "open" the sidebar navigation, set's it's width from 0 to 250px
        this.sidebarRef.current.style.width = "250px";
        // And at the same time, add a similar margin to main panel, which squishes the content over to make room for menu
        // The margin we're adding is slightly smaller so that the menu goes farther, and cover the original sidebar buttons
        this.mainRef.current.style.marginLeft = "180px";
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    /* Set the width of the side navigation to 0 */
    closeNav() {
        // Close the sidebar by setting width to 0
        this.sidebarRef.current.style.width = "0";
        // Re-open main page to full width
        this.mainRef.current.style.marginLeft = "0";
        console.log("going to set resize event in 1s");
        setTimeout(() => {
            window.dispatchEvent(new Event("resize"));
            // There's a listener out there for this in the DashboardChartCard, so it can trigger a resize of all active chart cards
        }, 1000);
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    render() {
        return (
            <HashRouter>
                {/* HashRouter can have only one child element, so adding a <div> */}
                <div>
                    <div ref={this.sidebarRef} id="mySidenav" className="sidenav">
                        {/* create a button to close the sidebar panel */}
                        <span className="closebtn" onClick={this.closeNav}>
                            &times;
                        </span>

                        <div>
                            Available Dashboards:
                            <Link to="/">Home</Link>
                            <Link to="/leankit-discovery-dashboard">Leankit Discovery Dashboard</Link>
                            <br />
                            <Link to="/everything-dashboard">Everything Dashboard</Link>
                            <Link to="/demo1-dashboard">Demo1 Dashboard</Link>
                            <Link to="/dev1-dashboard">Dev1 Dashboard</Link>
                        </div>
                        <div className="otherDetails">
                            <div className="title">Other Details:</div>
                            <div className="body">
                                <div>Environment: {process.env.NODE_ENV}</div>
                            </div>
                        </div>
                    </div>

                    <div id="main" ref={this.mainRef} className="page_container">
                        <div className="title_container">
                            <div className="title">
                                {this.state.pageTitle} v{process.env.REACT_APP_VERSION}
                            </div>
                        </div>
                        <div className="leftNav_container">
                            <div className="navPageNavigation">
                                {/* Create the hamburger menu button */}
                                <button className="navButtonsLeft" type="button" onClick={this.openNav}>
                                    &#9776;
                                </button>
                                {/* Show the time remaining until the next refresh */}
                                <div className="refreshTimeRemaining">{this.state.refreshRemainingMs / 1000}s</div>
                            </div>
                        </div>
                        <div className="centerPanel_container">
                            <Route
                                path="/everything-dashboard"
                                exact
                                render={() => (
                                    <EverythingCardGrid
                                        sn_instance={this.state.sn_instance}
                                        boldchat_instance={this.state.boldchat_instance}
                                        changeParentPageTitle={this.changePageTitle.bind(this)}
                                    />
                                )}
                            />
                            <Route
                                path="/demo1-dashboard"
                                exact
                                render={() => (
                                    <Demo1CardGrid
                                        sn_instance={this.state.sn_instance}
                                        boldchat_instance={this.state.boldchat_instance}
                                        changeParentPageTitle={this.changePageTitle.bind(this)}
                                    />
                                )}
                            />
                            <Route
                                path="/dev1-dashboard"
                                exact
                                render={() => (
                                    <Dev1CardGrid
                                        sn_instance={this.state.sn_instance}
                                        boldchat_instance={this.state.boldchat_instance}
                                        changeParentPageTitle={this.changePageTitle.bind(this)}
                                        refreshInterval={8000}
                                    />
                                )}
                            />
                            <Route
                                path="/leankit-discovery-dashboard"
                                exact
                                render={() => (
                                    <LeankitDiscoveryCardGrid
                                        sn_instance={this.state.sn_instance}
                                        leankit_instance="jnj.leankit.com"
                                        changeParentPageTitle={this.changePageTitle.bind(this)}
                                    />
                                )}
                            />
                            <Route
                                path="/"
                                exact
                                render={() => (
                                    <HomeCardGrid
                                        sn_instance={this.state.sn_instance}
                                        boldchat_instance={this.state.boldchat_instance}
                                        leankit_instance={this.state.leankit_instance}
                                        changeParentPageTitle={this.changePageTitle.bind(this)}
                                    />
                                )}
                            />
                        </div>
                    </div>
                </div>
            </HashRouter>
        );
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
}

Dashboard.propTypes = {
    refreshInterval: PropTypes.number.isRequired,
    refreshUpdateInterval: PropTypes.number.isRequired
};

// Set default props in case they aren't passed to us by the caller
Dashboard.defaultProps = { refreshUpdateInterval: 1000, refreshInterval: 8000 };

export default Dashboard;
