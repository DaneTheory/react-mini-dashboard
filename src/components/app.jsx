// 3rd party imports
import React from "react";
import { HashRouter, Route, Link } from "react-router-dom";

// My own imports
import Demo1CardGrid from "../cardgrids/Demo1CardGrid";
import AllCardGrid from "../cardgrids/AllCardGrid";
import Dev1CardGrid from "../cardgrids/Dev1CardGrid";
import LeankitDiscoveryCardGrid from "../cardgrids/LeankitDiscoveryCardGrid";

// let sn_instance = "jnjprodworker.service-now.com";
// let boldchat_instance = "api.boldchat.com";

// useless comment to trigge compile

class App extends React.Component {
    state = {
        pageTitle: "Original Title",
        sn_instance: "jnjprodworker.service-now.com",
        leankit_instance: "jnj.leankit.com",
        // sn_instance: "jnjsandbox.service-now.com",
        boldchat_instance: "api.boldchat.com"
    };

    // Later will pass this function to child components so they can change our Page Title
    changePageTitle(newTitle) {
        this.setState({ pageTitle: newTitle });
    }

    render() {
        return (
            <div>
                <HashRouter>
                    <div className="page_container">
                        <div className="title_container">
                            <div className="title">
                                Iris Dashboard ({process.env.NODE_ENV}) v{process.env.REACT_APP_VERSION}
                            </div>
                        </div>
                        <div className="leftNav_container">
                            <div className="navTitle">{this.state.pageTitle}</div>
                            <div className="navPageNavigation">
                                Dashboard Navigation:
                                <Link to="/">Home</Link>
                                <Link to="/everything-dashboard">Everything Dashboard</Link>
                                <Link to="/demo1-dashboard">Demo1 Dashboard</Link>
                                <Link to="/dev1-dashboard">Dev1 Dashboard</Link>
                                <Link to="/leankit-discovery-dashboard">Leankit Discovery Dashboard</Link>
                            </div>
                        </div>
                        <div className="centerPanel_container">
                            <Route
                                path="/everything-dashboard"
                                exact
                                render={() => (
                                    <AllCardGrid
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
                            <Route path="/" exact render={() => <h1>Home is Where the Blank Title Page Lives</h1>} />
                        </div>
                    </div>
                </HashRouter>
            </div>
        );
    }
}

export default App;
