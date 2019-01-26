// 3rd party imports
import React from "react";
import { HashRouter, Route, Link } from "react-router-dom";

// My own imports
import Demo1CardGrid from "../cardgrids/Demo1CardGrid";
import EverythingCardGrid from "../cardgrids/EverythingCardGrid";
import Dev1CardGrid from "../cardgrids/Dev1CardGrid";
import LeankitDiscoveryCardGrid from "../cardgrids/LeankitDiscoveryCardGrid";
import HomeCardGrid from "../cardgrids/HomeCardGrid";

// let sn_instance = "jnjprodworker.service-now.com";
// let boldchat_instance = "api.boldchat.com";

// useless comment to trigge compile

class App extends React.Component {
    state = {
        pageTitle: "Original Title",
        refreshRemainingSecs: 120,
        sn_instance: "jnjprodworker.service-now.com",
        leankit_instance: "jnj.leankit.com",
        // sn_instance: "jnjsandbox.service-now.com",
        boldchat_instance: "api.boldchat.com"
    };
    sidebarRef = React.createRef();
    mainRef = React.createRef();
    // This is our event handler, it's called from the outside world via an event subscription, and when called, it
    // won't know about "this", so we need to bind our current "this" to "this" within the function
    openNav = this.openNav.bind(this);
    closeNav = this.closeNav.bind(this);

    // Later will pass this function to child components so they can change our Page Title
    changePageTitle(newTitle) {
        this.setState({ pageTitle: newTitle });
    }

    setPageCountdown(numSecs) {
        this.setState({ refreshRemainingSecs: numSecs });
    }

    /* Set the width of the side navigation to 250px */
    openNav() {
        console.log("Trying to open");
        console.log(this.sidebarRef.current.style);
        this.sidebarRef.current.style.width = "250px";
        this.mainRef.current.style.marginLeft = "180px";
        // document.getElementById("mySidenav").style.width = "250px";
    }

    /* Set the width of the side navigation to 0 */
    closeNav() {
        console.log("Trying to close");
        // document.getElementById("mySidenav").style.width = "0";
        this.sidebarRef.current.style.width = "0";
        this.mainRef.current.style.marginLeft = "0";
    }

    render() {
        return (
            <HashRouter>
                <div>
                    <div ref={this.sidebarRef} id="mySidenav" className="sidenav">
                        {/* <a href="#" className="closebtn" onClick={this.closeNav}>
                            &times;
                        </a> */}
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
                                <div>Refresh countdown: {this.state.refreshRemainingSecs / 1000}s</div>
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
                                        setPageCountdown={this.setPageCountdown.bind(this)}
                                        refreshInterval="15000"
                                    />
                                )}
                            />
                            <Route
                                path="/leankit-discovery-dashboard"
                                exact
                                render={() => (
                                    <LeankitDiscoveryCardGrid
                                        sn_instance={this.state.sn_instance}
                                        leankit_instance={this.state.leankit_instance}
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
}

export default App;
