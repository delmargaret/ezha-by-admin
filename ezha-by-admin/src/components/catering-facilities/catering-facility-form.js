import React, { Component } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";

import Towns from "../towns";
import CateringFacilityTypes from "../catering-facility-types";

export default class CateringFacilityForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: [...props.tags],
      cateringFacilityTags: [...props.cateringFacilityTags],
    };

    this.nameInput = React.createRef();
    this.typeInput = React.createRef();
    this.workingHoursInput = React.createRef();
    this.deliveryPriceInput = React.createRef();
    this.deliveryTimeInput = React.createRef();
    this.townInput = React.createRef();
    this.streetInput = React.createRef();
    this.houseInput = React.createRef();
    this.tagInput = React.createRef();

    this.onTagAdd = this.onTagAdd.bind(this);
    this.onTagDelete = this.onTagDelete.bind(this);

    this.shouldDisableTagSelector = this.shouldDisableTagSelector.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.tags === this.props.tags &&
      prevProps.cateringFacilityTags === this.props.cateringFacilityTags
    )
      return;

    this.setState({
      tags: [...this.props.tags],
      cateringFacilityTags: [...this.props.cateringFacilityTags],
    });
  }

  shouldDisableTagSelector() {
    let tagsToShow = this.state.tags.filter(
      (tag) =>
        !this.state.cateringFacilityTags.some((cfTag) => tag.id === cfTag.id)
    );

    return tagsToShow.length === 0;
  }

  renderTagsOptions() {
    return this.state.tags
      .filter(
        (tag) =>
          !this.state.cateringFacilityTags.some((cfTag) => tag.id === cfTag.id)
      )
      .map((tag) => {
        return (
          <option key={tag.id} value={tag.id}>
            {tag.tagName}
          </option>
        );
      });
  }

  renderTagsPreview() {
    return this.state.cateringFacilityTags.map((tag) => (
      <div className="preview" key={tag.id}>
        {tag.tagName}
        <span className="close" onClick={() => this.onTagDelete(tag.id)}>
          x
        </span>
      </div>
    ));
  }

  onTagDelete(tagId) {
    this.setState({
      cateringFacilityTags: this.state.cateringFacilityTags.filter(
        (cfTag) => cfTag.id !== tagId
      ),
    });
  }

  onTagAdd() {
    const tagIdToAdd = this.tagInput.current.value;

    let cateringFacilityTags = [...this.state.cateringFacilityTags];

    cateringFacilityTags.push(
      this.state.tags.find((tag) => tag.id === tagIdToAdd)
    );

    this.setState({
      cateringFacilityTags: cateringFacilityTags,
    });
  }

  render() {
    return (
      <React.Fragment>
        <Row>
          <Form.Group as={Col} controlId="nameValidationGroup">
            <Form.Label>Название заведения</Form.Label>
            <Form.Control ref={this.nameInput} type="text" required />
            <Form.Control.Feedback type="invalid">
              Введите название заведения
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row>
          <Col>
            <CateringFacilityTypes ref={this.typeInput} />
          </Col>
          <Form.Group as={Col} controlId="workingHoursValidationGroup">
            <Form.Label>Время работы</Form.Label>
            <Form.Control ref={this.workingHoursInput} type="text" required />
            <Form.Control.Feedback type="invalid">
              Введите время работы
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row>
          <Form.Group as={Col} controlId="deliveryPriceValidationGroup">
            <Form.Label>Стоимость доставки</Form.Label>
            <Form.Control
              ref={this.deliveryPriceInput}
              type="number"
              min="0"
              step="0.01"
              required
            />
            <Form.Control.Feedback type="invalid">
              Введите стоимость доставки
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} controlId="deliveryTimeValidationGroup">
            <Form.Label>Время доставки</Form.Label>
            <Form.Control ref={this.deliveryTimeInput} type="text" required />
            <Form.Control.Feedback type="invalid">
              Введите время доставки
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row>
          <Col>
            <Towns ref={this.townInput} />
          </Col>
        </Row>
        <Row>
          <Form.Group as={Col} controlId="streetValidationGroup">
            <Form.Label>Улица</Form.Label>
            <Form.Control ref={this.streetInput} type="text" required />
            <Form.Control.Feedback type="invalid">
              Введите улицу
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} controlId="houseValidationGroup">
            <Form.Label>Дом</Form.Label>
            <Form.Control ref={this.houseInput} type="text" required />
            <Form.Control.Feedback type="invalid">
              Введите дом
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Form.Group>
          <Form.Label>Тэги</Form.Label>
          <Row>
            <Col>
              <Form.Control
                as="select"
                disabled={this.shouldDisableTagSelector()}
                ref={this.tagInput}
              >
                {this.renderTagsOptions()}
              </Form.Control>
            </Col>
            <Col sm="3">
              <Button onClick={this.onTagAdd} className="btn-red">
                Добавить
              </Button>
            </Col>
          </Row>
        </Form.Group>
        <Col>
          <div ref={this.previewTag}>{this.renderTagsPreview()}</div>
        </Col>
        <br />
      </React.Fragment>
    );
  }
}
