import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { Row, Col } from "react-bootstrap";

import NavbarComponent from "./components/nav-bar/nav-bar";
import NavTabs from "./components/nav-tabs/nav-tabs";

import LoginPage from "./components/login-page/login-page";

import TagsPage from "./components/tags/tags";
import CateringFacilitiesRouter from "./components/catering-facilities/catering-facilities-router";
import CategoriesPage from "./components/categories/categories";
import DishesRouter from "./components/dishes/dishes-router";
import PartnerRequestsPage from "./components/requests/partner-requests";
import CourierRequestsPage from "./components/requests/courier-requests";
import FeedbacksPage from "./components/feedbacks/feedbacks";

import FooterComponent from "./components/footer/footer";

import Emitter from "./services/event-emitter";
import LoginService from "./services/login-service";
import { USER_LOGGED } from "./services/login-service";
import { USER_LOGGED_OUT } from "./services/login-service";

import "./App.css";

import "./../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./../node_modules/react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";
import "./../node_modules/react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

import leaves from "./leaves.png";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthorized: false,
      role: null,
    };

    this.onUserLogout = this.onUserLogout.bind(this);
    this.onUserLogin = this.onUserLogin.bind(this);
  }

  onUserLogin() {
    var user = LoginService.getUser();

    if (!user || !user.token) {
      this.setState({
        isAuthorized: false,
        role: null,
      });

      return;
    }

    this.setState({
      isAuthorized: true,
      role: user.role,
    });
  }

  onUserLogout() {
    LoginService.removeUser();

    this.setState({
      isAuthorized: false,
      role: null,
    });
  }

  componentDidMount() {
    this.onUserLogin();

    Emitter.on(USER_LOGGED, this.onUserLogin);
    Emitter.on(USER_LOGGED_OUT, this.onUserLogout);
  }

  componentWillUnmount() {
    Emitter.off(USER_LOGGED);
    Emitter.off(USER_LOGGED_OUT);
  }

  render() {
    const { isAuthorized } = this.state;

    const nonAuthenticatedElement = (
      <Router>
        <NavbarComponent isAuthorized={isAuthorized} />
        <Row id="main-row">
          <Col>
            {" "}
            <img alt="" src={leaves} className="leaves-left" />
          </Col>
          <Col xs={8}>
            <Switch>
              <Route exact path="/">
                <Redirect to="/login" />
              </Route>
              <Route path="/login">
                <LoginPage />
              </Route>
              <Route path="*">
                <Redirect to="/login" />
              </Route>
            </Switch>
          </Col>
          <Col>
            <img alt="" src={leaves} className="leaves-right" />
          </Col>
        </Row>
        <br />
        <FooterComponent />
      </Router>
    );

    const authenticatedElement = (
      <Router>
        <NavbarComponent isAuthorized={isAuthorized} />
        <NavTabs activeKey={window.location.pathname.slice(1) || "tags"} />
        <Row id="main-row">
          <Col>
            {" "}
            <img alt="" src={leaves} className="leaves-left" />
          </Col>
          <Col xs={8}>
            <Switch>
              <Route exact path="/">
                <Redirect to="/tags" />
              </Route>
              <Route path="/tags">
                <TagsPage />
              </Route>
              <Route path="/catering-facilities">
                <CateringFacilitiesRouter />
              </Route>
              <Route path="/categories">
                <CategoriesPage />
              </Route>
              <Route path="/dishes">
                <DishesRouter />
              </Route>
              <Route path="/partners">
                <PartnerRequestsPage />
              </Route>
              <Route path="/couriers">
                <CourierRequestsPage />
              </Route>
              <Route path="/feedbacks">
                <FeedbacksPage />
              </Route>
              <Route path="/login">
                <Redirect to="/" />
              </Route>
            </Switch>
          </Col>
          <Col>
            <img alt="" src={leaves} className="leaves-right" />
          </Col>
        </Row>
        <br />
        <FooterComponent />
      </Router>
    );

    return (
      <div className="App">
        {isAuthorized ? authenticatedElement : nonAuthenticatedElement}
      </div>
    );
  }
}
