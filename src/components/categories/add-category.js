import React, { Component } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import CategoriesService from "../../services/categories-service";

export default class AddCategoryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validated: false
    };

    this.categoryNameInput = React.createRef();
    this.onCategoryAdd = this.onCategoryAdd.bind(this);
  }

  async onCategoryAdd(event) {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;
    if (form.checkValidity()) {
      await CategoriesService.createCategory(
        this.props.cateringFacilityId,
        this.categoryNameInput.current.value
      );
    }

    this.setState({
      validated: true
    });
  }

  render() {
    const { validated } = this.state;

    return (
      <React.Fragment>
        <Form noValidate validated={validated} onSubmit={this.onCategoryAdd}>
          <Form.Label>Новая категория</Form.Label>
          <Row>
            <Col sm="4">
              <Form.Group>
                <Form.Control
                  ref={this.categoryNameInput}
                  type="text"
                  placeholder="Название категории"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Введите название категории
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Button className="btn-red" type="submit">
                Добавить
              </Button>
            </Col>
          </Row>
        </Form>
      </React.Fragment>
    );
  }
}
