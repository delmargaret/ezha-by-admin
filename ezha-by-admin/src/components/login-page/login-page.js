import React, { Component } from "react";
import { Form, Col, Row, Button, Alert } from "react-bootstrap";

import Emitter from "../../services/event-emitter";
import LoginService from "../../services/login-service";
import {
  USER_LOGGED,
  CREDENTIALS_NOT_FOUND,
  WRONG_ROLE,
  CREDENTIALS_OK,
  CREDENTIALS_NOT_CHECKED
} from "../../services/login-service";

const ALLOWED_ROLE = "Admin";

export default class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validated: false,
      authResult: CREDENTIALS_NOT_CHECKED,
    };

    this.emailInput = React.createRef();
    this.passwordInput = React.createRef();

    this.onLogin = this.onLogin.bind(this);
  }

  async onLogin(event) {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;

    let result = CREDENTIALS_NOT_CHECKED;

    if (form.checkValidity()) {
      result = await LoginService.setUserInRole(
        this.emailInput.current.value,
        this.passwordInput.current.value,
        ALLOWED_ROLE
      );
    }

    this.setState({
      validated: true,
      authResult: result,
    });
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    const { authResult } = this.state;

    if (authResult === CREDENTIALS_OK) Emitter.emit(USER_LOGGED, {});
  }

  render() {
    const { validated, authResult } = this.state;

    const credentialsNotFoundElement = (
      <Row>
        <Col></Col>
        <Col sm="7">
          <Alert variant="secondary">
            <p>
              К сожалению, пользователь не обнаружен в системе. Пожалуйста, проверьте
              вводимые данные и попробуйте ещё раз.
            </p>
          </Alert>
        </Col>
        <Col></Col>
      </Row>
    );

    const wrongRoleElement = (
      <Row>
        <Col></Col>
        <Col sm="7">
          <Alert variant="secondary">
            <p>
              К сожалению, Ваша роль в системе не позволяет воспользоваться
              данным функционалом. Обратитесь к администратору, пожалуйста.
            </p>
          </Alert>
        </Col>
        <Col></Col>
      </Row>
    );

    const infoPanels = {
      [CREDENTIALS_NOT_FOUND]: credentialsNotFoundElement,
      [WRONG_ROLE]: wrongRoleElement,
      [CREDENTIALS_OK]: null,
    };

    return (
      <React.Fragment>
        <br />
        <br />
        {infoPanels[authResult]}
        <Row>
          <Col></Col>
          <Col sm="7">
            <Form
              noValidate
              validated={validated}
              onSubmit={this.onLogin}
              className="app-form"
            >
              <Row>
                <Form.Group as={Col}>
                  <Form.Label>E-mail</Form.Label>
                  <Form.Control ref={this.emailInput} type="email" required />
                  <Form.Control.Feedback type="invalid">
                    Введите e-mail
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col}>
                  <Form.Label>Пароль</Form.Label>
                  <Form.Control
                    ref={this.passwordInput}
                    type="password"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Введите пароль
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Button type="submit" className="btn-red">
                Вход
              </Button>
            </Form>
          </Col>
          <Col></Col>
        </Row>
      </React.Fragment>
    );
  }
}
