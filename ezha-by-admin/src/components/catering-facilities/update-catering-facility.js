import React, { Component } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";

import CateringFacilityForm from "./catering-facility-form";
import CateringFacilitiesService from "../../services/catering-facilities-service";
import TagsService from "../../services/tags-service";
import arrowLeft from "./../../arrow-left.png";

export default class UpdateCateringFacility extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cateringFacilityTags: [],
      tags: [],
      needRedirect: false,
      validated: false,
    };

    this.editorForm = React.createRef();
    this.onCateringFacilityUpdate = this.onCateringFacilityUpdate.bind(this);
  }

  async componentDidMount() {
    const { id } = this.props.match.params;

    const facility = await CateringFacilitiesService.getCateringFacility(id);

    if (facility) {
      const {
        nameInput,
        deliveryTimeInput,
        deliveryPriceInput,
        typeInput,
        workingHoursInput,
        townInput,
        streetInput,
        houseInput,
      } = this.editorForm.current;
  
      nameInput.current.value = facility.data.cateringFacilityName;
      deliveryTimeInput.current.value = facility.data.deliveryTime;
      deliveryPriceInput.current.value = facility.data.deliveryPrice;
      typeInput.current.type.current.value = facility.data.cateringFacilityType;
      workingHoursInput.current.value = facility.data.workingHours;
      townInput.current.town.current.value = facility.data.town;
      streetInput.current.value = facility.data.street;
      houseInput.current.value = facility.data.houseNumber;
  
      const tags = await TagsService.getTags();
  
      this.setState({
        cateringFacilityTags: [...facility.data.cateringFacilityTags],
        tags: tags ? [...tags.data] : [],
        needRedirect: false,
        validated: false,
      });
    }
  }

  onCateringFacilityUpdate(event) {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;
    let needRedirect = false;

    if (form.checkValidity()) {
      needRedirect = true;

      const {
        nameInput,
        deliveryTimeInput,
        deliveryPriceInput,
        typeInput,
        workingHoursInput,
        townInput,
        streetInput,
        houseInput,
        state,
      } = this.editorForm.current;

      const name = nameInput.current.value;
      const deliveryTime = deliveryTimeInput.current.value;
      const deliveryPrice = deliveryPriceInput.current.value;
      const type = typeInput.current.type.current.value;
      const workingHours = workingHoursInput.current.value;
      const town = townInput.current.town.current.value;
      const street = streetInput.current.value;
      const house = houseInput.current.value;
      const tagIds = state.cateringFacilityTags.map((tag) => tag.id);

      CateringFacilitiesService.updateCateringFacility(
        this.props.match.params.id,
        name,
        deliveryTime,
        deliveryPrice,
        type,
        workingHours,
        town,
        street,
        house,
        tagIds
      );
    }

    this.setState({
      needRedirect: needRedirect,
      validated: true,
    });
  }

  render() {
    const { cateringFacilityTags, tags, needRedirect, validated } = this.state;

    const cateringFacilitiesRootPath = "/catering-facilities";

    const redirectElement = <Redirect to={cateringFacilitiesRootPath} />;

    const formElement = (
      <React.Fragment>
        <br />
        <br />
        <LinkContainer to="/catering-facilities" isActive={() => false}>
          <img className="back-btn" alt="" width="35px" src={arrowLeft} />
        </LinkContainer>
        <br />
        <br />
        <Row>
          <Col></Col>
          <Col sm="7">
            <Form
              noValidate
              validated={validated}
              onSubmit={this.onCateringFacilityUpdate}
              className="app-form"
            >
              <CateringFacilityForm
                cateringFacilityTags={cateringFacilityTags}
                tags={tags}
                ref={this.editorForm}
              />
              <Button type="submit" className="btn-red">
                Изменить
              </Button>
            </Form>
          </Col>
          <Col></Col>
        </Row>
      </React.Fragment>
    );

    return needRedirect ? redirectElement : formElement;
  }
}
