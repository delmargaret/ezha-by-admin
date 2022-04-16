import React, { Component } from "react";
import { Navbar } from "react-bootstrap";

export default class FooterComponent extends Component {
  render() {
    return (
      <Navbar bg="light" className="footer">
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text style={{ fontSize: "14px" }}>
            Ezha.by@{new Date().getFullYear()}
          </Navbar.Text>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
