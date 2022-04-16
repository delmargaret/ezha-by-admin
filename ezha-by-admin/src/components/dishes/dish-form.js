import React, { Component } from "react";
import { Form, Col, Row } from "react-bootstrap";

export default class DishForm extends Component {
  constructor(props) {
    super(props);

    this.nameInput = React.createRef();
    this.descritionInput = React.createRef();
    this.priceInput = React.createRef();
    this.categoryInput = React.createRef();
  }

  renderCategoriesOptions() {
    return this.props.categories.map((it) => (
      <option key={it.id} value={it.id}>
        {it.categoryName}
      </option>
    ));
  }

  render() {
    return (
      <React.Fragment>
        <Row>
          <Form.Group as={Col} controlId="nameValidationGroup">
            <Form.Label>Название блюда</Form.Label>
            <Form.Control ref={this.nameInput} type="text" required />
            <Form.Control.Feedback type="invalid">
              Введите название блюда
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row>
          <Form.Group as={Col} controlId="descriptionValidationGroup">
            <Form.Label>Описание</Form.Label>
            <Form.Control
              ref={this.descritionInput}
              as="textarea"
              type="text"
              required
              maxLength={120}
            />
            <Form.Control.Feedback type="invalid">
              Введите описание блюда
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row>
          <Form.Group as={Col} controlId="priceValidationGroup">
            <Form.Label>Цена</Form.Label>
            <Form.Control
              ref={this.priceInput}
              type="number"
              min="0"
              step="0.01"
              required
            />
            <Form.Control.Feedback type="invalid">
              Введите цену блюда
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row>
          <Form.Group as={Col} controlId="categoryValidationGroup">
            <Form.Label>Категория</Form.Label>
            <Form.Control as="select" ref={this.categoryInput}>
              {this.renderCategoriesOptions()}
            </Form.Control>
          </Form.Group>
        </Row>
      </React.Fragment>
    );
  }
}
