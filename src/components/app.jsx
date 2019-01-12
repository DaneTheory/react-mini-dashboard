// 3rd party imports
import React from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";

// My own imports
import CardGrid from "./cardGrid";
import unsplash from "../api/unsplash";

// My own imports, namely Widgets
import WidgetSNINCP1P2Count from "../widgets/WidgetSNINCP1P2Count";
import WidgetSNUniqueLoginsToday from "../widgets/WidgetSNUniqueLoginsToday";
import WidgetSNCurrentUsers from "../widgets/WidgetSNCurrentUsers";
import WidgetSNNewIncidentToday from "../widgets/WidgetsSNNewIncidentsToday";
import WidgetSNClicksByOS from "../widgets/WidgetSNClicksByOS";
import WidgetSNClicksByBrowser from "../widgets/WidgetSNClicksByBrowser";
import WidgetBoldChatActiveCount from "../widgets/WidgetBoldChatActiveCount";
import WidgetBoldChatInactiveCount from "../widgets/WidgetBoldChatInactiveCount";
import WidgetLeankitCount from "../widgets/WidgetLeankitCount";

import demo1CardGrid from "../cardgrids/demo1CardGrid";

let sn_instance = "jnjprodworker.service-now.com";
let boldchat_instance = "api.boldchat.com";

// ----

const PageOneTitle = () => {
    return <div>PageOne</div>;
};

const PageOneWidgets = () => {
    return (
        <div>
            <CardGrid rows="7" columns="6">
                <WidgetSNINCP1P2Count color="#3a5174" position="1 / 3 / span 1 / span 2" id="2" instance={sn_instance} />
                <WidgetSNINCP1P2Count color="#3a5174" position="1 / 5 / span 1 / span 1" id="3" instance={sn_instance} />
                <WidgetSNINCP1P2Count color="#3a5174" position="2 / 3 / span 1 / span 1" id="4" instance={sn_instance} />
                <WidgetSNINCP1P2Count color="#3a5174" position="2 / 4 / span 1 / span 1" id="5" instance={sn_instance} />
                <WidgetSNINCP1P2Count color="#3a5174" position="3 / 3 / span 1 / span 1" id="6" instance={sn_instance} />
                <WidgetSNINCP1P2Count color="#3a5174" id="6" instance={sn_instance} />
                <WidgetSNINCP1P2Count color="#3a5174" instance={sn_instance} />
                <WidgetSNUniqueLoginsToday color="slategrey" instance={sn_instance} />
                <WidgetSNCurrentUsers color="darkgreen" instance={sn_instance} />
                <WidgetSNNewIncidentToday color="orangered" position="span 1/span 1" instance={sn_instance} />
                <WidgetSNClicksByOS color="darkolivegreen" position="span 3/span 1" instance={sn_instance} />
                <WidgetSNClicksByBrowser color="darkolivegreen" position="span 3/span 1" instance={sn_instance} />
                <WidgetLeankitCount color="mediumpurple" position="span 1/span 1" instance="jnj.leankit.com" />
                <WidgetBoldChatActiveCount color="IndianRed" position="span 1/span 1" instance={boldchat_instance} />
                <WidgetBoldChatInactiveCount color="IndianRed" position="span 1/span 1" instance={boldchat_instance} />
            </CardGrid>
        </div>
    );
};

const PageTwoTitle = () => {
    return <div>PageTwoWidgets</div>;
};

const PageTwoWidgets = () => {
    return (
        <div>
            <CardGrid rows="7" columns="6">
                <WidgetSNINCP1P2Count color="#3a5174" position="1 / 3 / span 1 / span 2" id="2" instance={sn_instance} />
            </CardGrid>
        </div>
    );
};

class App extends React.Component {
    state = {
        // we expect this to be an array, so set to empty array because that will prevent .map() null issues later
        images: []
    };

    onSearchSubmit = async term => {
        const response = await unsplash.get("https://api.unsplash.com/search/photos", {
            params: { query: "Cars" }
        });

        this.setState({ images: response.data.results });
        console.log("state images", this.state.images);
    };

    render() {
        // let instance = "jnjsandbox.service-now.com";

        return (
            <div>
                <BrowserRouter>
                    <div className="page_container">
                        <div className="title_container">
                            <div className="title">
                                Iris Dashboard ({process.env.NODE_ENV}) v{process.env.REACT_APP_VERSION}
                            </div>
                        </div>
                        <div className="leftNav_container">
                            <div>
                                <br />
                                Page Title:
                                <Route path="/" exact component={PageOneTitle} />
                                <Route path="/pagetwo" component={PageTwoTitle} />
                                <br />
                                <br />
                                Page Navigation:
                                <br />
                                <Link to="/">Go to PageOne</Link>
                                <br />
                                <Link to="/pagetwo">Go to PageTwo</Link>
                                <br />
                                <br />
                            </div>
                        </div>
                        <div className="centerPanel_container">
                            <Route path="/" exact component={PageOneWidgets} />
                            <Route path="/pagetwo" exact component={PageTwoWidgets} />
                        </div>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;
