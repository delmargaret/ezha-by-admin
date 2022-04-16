import React from "react";
import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";
import './nav-tabs.css'

export default function(props) {
  return (
    <Nav fill variant="tabs" defaultActiveKey={props.activeKey} id="app-nav-tabs">
      <Nav.Item>
        <LinkContainer to="/tags">
          <Nav.Link eventKey="tags">Тэги</Nav.Link>
        </LinkContainer>
      </Nav.Item>
      <Nav.Item>
        <LinkContainer to="/catering-facilities">
          <Nav.Link eventKey="catering-facilities">Заведения</Nav.Link>
        </LinkContainer>
      </Nav.Item>
      <Nav.Item>
        <LinkContainer to="/categories">
          <Nav.Link eventKey="categories">Категории блюд</Nav.Link>
        </LinkContainer>
      </Nav.Item>
      <Nav.Item>
        <LinkContainer to="/dishes">
          <Nav.Link eventKey="dishes">Блюда</Nav.Link>
        </LinkContainer>
      </Nav.Item>
      <Nav.Item>
        <LinkContainer to="/partners">
          <Nav.Link eventKey="partners">Партнеры</Nav.Link>
        </LinkContainer>
      </Nav.Item>
      <Nav.Item>
        <LinkContainer to="/couriers">
          <Nav.Link eventKey="couriers">Курьеры</Nav.Link>
        </LinkContainer>
      </Nav.Item>
      <Nav.Item>
        <LinkContainer to="/feedbacks">
          <Nav.Link eventKey="feedbacks">Обратная связь</Nav.Link>
        </LinkContainer>
      </Nav.Item>
    </Nav>
  );
}
