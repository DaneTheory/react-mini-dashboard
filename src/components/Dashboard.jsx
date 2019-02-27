// 3rd party imports
import React from "react";
import { HashRouter, Route, Link, Redirect } from "react-router-dom";
import PubSub from "pubsub-js";
import PropTypes from "prop-types";

// project imports
import Demo1CardGrid from "../cardgrids/Demo1CardGrid";
import EverythingCardGrid from "../cardgrids/EverythingCardGrid";
import Dev1CardGrid from "../cardgrids/Dev1CardGrid";
import LeankitDiscoveryCardGrid from "../cardgrids/LeankitDiscoveryCardGrid";
import LeankitDeliveryCardGrid from "../cardgrids/LeankitDeliveryCardGrid";
import IrisReleaseNotesCardGrid from "../cardgrids/IrisReleaseNotesCardGrid";

class Dashboard extends React.Component {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    constructor(props) {
        super(props);

        this.state = {
            pageTitle: "Original Title",
            // time remaining until next data refresh PubSub
            refreshRemainingMs: props.refreshInterval
        };

        // So we can keep track of the once-per-second timeout
        this.intervalHandle = null;

        this.slidingSideBarRef = React.createRef();
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
        this.slidingSideBarRef.current.style.width = "250px";
        // And at the same time, add a similar margin to main panel, which squishes the content over to make room for menu
        // The margin we're adding is slightly smaller so that the menu goes farther, and cover the original sidebar buttons
        this.mainRef.current.style.marginLeft = "180px";
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    /* Set the width of the side navigation to 0 */
    closeNav() {
        // Close the sidebar by setting width to 0
        this.slidingSideBarRef.current.style.width = "0";
        // Re-open main page to full width
        this.mainRef.current.style.marginLeft = "0";
        console.log("going to set resize event in 1s");
        setTimeout(() => {
            window.dispatchEvent(new Event("resize"));
            // There's a listener out there for this in the DashboardChartJSCard, so it can trigger a resize of all active chart cards
        }, 1000);
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    doSomethingForDebugging() {
        console.log("Clicked on Title, this function used for inserting a quick function for debugging");
        let colorVariableName = "colorThemePageBackground";
        document.documentElement.style.setProperty("--" + colorVariableName, "#a7a");
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    render() {
        return (
            <HashRouter>
                {/* HashRouter can have only one child element, so adding a <div> */}
                <div>
                    {/* Sidebar */}
                    <div ref={this.slidingSideBarRef} className="slidingSideNav">
                        {/* create a button to close the sidebar panel */}
                        <span className="closebtn" onClick={this.closeNav}>
                            &times;
                        </span>

                        <div>
                            <div className={"Font18x"} style={{ textDecoration: "underline" }}>
                                Available Dashboards:
                            </div>
                            <Link to="/">Home</Link>
                            <Link to="/demo1-dashboard">Demo1 Dashboard</Link>
                            <Link to="/releasenotes">Iris Release Notes</Link>
                            <Link to="/leankit-discovery-dashboard">Leankit Discovery Dashboard</Link>
                            <Link to="/leankit-delivery-dashboard">Leankit Delivery Dashboard</Link>
                            <br />
                            <br />
                            <br />
                            <div className={"Font18x"} style={{ textDecoration: "underline" }}>
                                Other Dashboards:
                            </div>
                            <Link to="/everything-dashboard">Everything Dashboard</Link>
                            <Link to="/dev1-dashboard">Dev1 Dashboard</Link>
                        </div>
                        <div className="otherDetails">
                            <div className="title">Other Details:</div>
                            <div className="body">
                                <div>Environment: {process.env.NODE_ENV}</div>
                                <div>Custom Env: {process.env.REACT_ENV}</div>
                            </div>
                        </div>
                    </div>

                    {/* Main page_container: contains title, fixed sidbar, and widgets */}
                    <div id="main" ref={this.mainRef} className="page_container">
                        <div className="title_container">
                            <div className="title" onClick={this.doSomethingForDebugging}>
                                {this.state.pageTitle}
                            </div>
                        </div>
                        <div className="fixedSideBar_container">
                            {/* Create the hamburger menu button */}
                            <button className="navButtonsLeft" type="button" onClick={this.openNav}>
                                &#9776;
                            </button>
                            {/* Show the time remaining until the next refresh */}
                            <div className="refreshTimeRemaining">{this.state.refreshRemainingMs / 1000}s</div>
                            <div className="versionTitleNestedOuter">
                                <div className="versionTitleNestedInner Font18x">
                                    {process.env.REACT_APP_ENV} v{process.env.REACT_APP_VERSION}
                                </div>
                            </div>
                        </div>
                        <div className="centerPanel_container">
                            <Route
                                path="/everything-dashboard"
                                exact
                                render={() => (
                                    <EverythingCardGrid
                                        sn_instance={this.props.sn_instance}
                                        boldchat_instance={this.props.boldchat_instance}
                                        changeParentPageTitle={this.changePageTitle.bind(this)}
                                        leankit_instance={this.props.leankit_instance}
                                    />
                                )}
                            />
                            <Route
                                path="/demo1-dashboard"
                                exact
                                render={() => (
                                    <Demo1CardGrid
                                        sn_instance={this.props.sn_instance}
                                        boldchat_instance={this.props.boldchat_instance}
                                        changeParentPageTitle={this.changePageTitle.bind(this)}
                                    />
                                )}
                            />
                            <Route
                                path="/releasenotes"
                                exact
                                render={() => (
                                    <IrisReleaseNotesCardGrid
                                        sn_instance={this.props.sn_instance}
                                        changeParentPageTitle={this.changePageTitle.bind(this)}
                                    />
                                )}
                            />
                            <Route
                                path="/dev1-dashboard"
                                exact
                                render={() => (
                                    <Dev1CardGrid
                                        sn_instance={this.props.sn_instance}
                                        boldchat_instance={this.props.boldchat_instance}
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
                                        sn_instance={this.props.sn_instance}
                                        leankit_instance={this.props.leankit_instance}
                                        changeParentPageTitle={this.changePageTitle.bind(this)}
                                    />
                                )}
                            />
                            <Route
                                path="/leankit-delivery-dashboard"
                                exact
                                render={() => (
                                    <LeankitDeliveryCardGrid
                                        sn_instance={this.props.sn_instance}
                                        leankit_instance={this.props.leankit_instance}
                                        changeParentPageTitle={this.changePageTitle.bind(this)}
                                    />
                                )}
                            />
                            <Route path="/" exact render={() => <Redirect to="/demo1-dashboard" />} />
                        </div>
                    </div>
                </div>
            </HashRouter>
        );
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
}

// Set default props in case they aren't passed to us by the caller
Dashboard.defaultProps = {
    refreshUpdateInterval: 1000,
    refreshInterval: 8000,
    sn_instance: "jnjprodworker.service-now.com",
    boldchat_instance: "api.boldchat.com",
    leankit_instance: "jnj.leankit.com"
};

Dashboard.propTypes = {
    refreshInterval: PropTypes.number.isRequired,
    refreshUpdateInterval: PropTypes.number.isRequired,
    sn_instance: PropTypes.string.isRequired,
    boldchat_instance: PropTypes.string.isRequired,
    leankit_instance: PropTypes.string.isRequired,
    theme: PropTypes.shape({
        colorThemePageBackground: PropTypes.string
    })
};

export default Dashboard;
