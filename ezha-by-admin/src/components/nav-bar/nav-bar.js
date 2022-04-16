import React, { Component } from "react";
import { Navbar, Nav } from "react-bootstrap";

import { USER_LOGGED_OUT } from "../../services/login-service";

import logo from "./../../logo9.png";
import Emitter from "../../services/event-emitter";

export default class NavbarComponent extends Component {
  constructor(props) {
    super(props);

    this.logOut = this.logOut.bind(this);
  }

  logOut(event) {
    event.preventDefault();

    Emitter.emit(USER_LOGGED_OUT, {});
  }

  render() {
    const { isAuthorized } = this.props;

    const logout = (
      <Navbar.Collapse className="justify-content-end">
        <Nav.Link className="app-link" onClick={this.logOut}>
          Выход
        </Nav.Link>
      </Navbar.Collapse>
    );

    return (
      <Navbar bg="light">
        <Navbar.Brand id="logo-img">
          <img src={logo} width="150" alt="React Bootstrap logo" />
        </Navbar.Brand>
        {isAuthorized ? logout : null}
      </Navbar>
    );
  }
}
