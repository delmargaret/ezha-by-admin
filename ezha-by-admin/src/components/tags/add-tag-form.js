import React, { Component } from 'react';
import { Button, Form, Col, Row } from 'react-bootstrap';
import TagsService from '../../services/tags-service';

export default class AddTagForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validated: false,
    };

    this.tagNameInput = React.createRef();
    this.onTagAdd = this.onTagAdd.bind(this);
  }

  async onTagAdd(event) {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;
    if (form.checkValidity()) {
      await TagsService.createTag(this.tagNameInput.current.value);
    }

    this.setState({
      validated: true,
    });
  }

  render() {
    const { validated } = this.state;

    return (
      <React.Fragment>
        <br />
        <Form noValidate validated={validated} onSubmit={this.onTagAdd}>
          <Form.Label>Новый тэг</Form.Label>
          <Row>
            <Col sm="4">
              <Form.Group controlId="tagName">
                <Form.Control
                  ref={this.tagNameInput}
                  type="text"
                  placeholder="Название тэга"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Введите название тэга
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
