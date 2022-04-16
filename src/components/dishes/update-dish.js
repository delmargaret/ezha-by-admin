import React, { Component } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

import DishesService from '../../services/dishes-service';
import DishForm from './dish-form';
import CategoriesService from '../../services/categories-service';
import arrowLeft from './../../arrow-left.png';

export default class UpdateDish extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      needRedirect: false,
      validated: false,
    };

    this.formResults = React.createRef();
    this.onDishUpdate = this.onDishUpdate.bind(this);
  }

  async componentDidMount() {
    const { cateringFacilityId, id } = this.props.match.params;

    const categoriesList = await CategoriesService.getCategories(
      cateringFacilityId
    );

    const dishDetails = await DishesService.getDish(id);

    this.setState({
      categories: categoriesList ? categoriesList.data : [],
      needRedirect: false,
      validated: false,
    });

    const {
      nameInput,
      descritionInput,
      priceInput,
      categoryInput,
    } = this.formResults.current;

    if (dishDetails) {
      nameInput.current.value = dishDetails.data.dishName;
      descritionInput.current.value = dishDetails.data.description;
      priceInput.current.value = dishDetails.data.price;
      categoryInput.current.value = dishDetails.data.cateringFacilityCategory.id;
    }
  }

  async onDishUpdate(event) {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;
    let needRedirect = false;

    if (form.checkValidity()) {
      needRedirect = true;

      const { id } = this.props.match.params;

      const {
        nameInput,
        descritionInput,
        priceInput,
        categoryInput,
      } = this.formResults.current;

      const name = nameInput.current.value;
      const description = descritionInput.current.value;
      const price = priceInput.current.value;
      const categoryId = categoryInput.current.value;

      await DishesService.updateDish(id, name, description, price, categoryId);
    }

    this.setState({
      needRedirect: needRedirect,
      validated: true,
    });
  }

  render() {
    const { categories, needRedirect, validated } = this.state;
    const { cateringFacilityId } = this.props.match.params;

    const dishesCateringFacilityPage = `/dishes/catering-facility/${cateringFacilityId}`;

    const redirectElement = <Redirect to={dishesCateringFacilityPage} />;

    const formElement = (
      <React.Fragment>
        <br />
        <br />
        <LinkContainer to={dishesCateringFacilityPage} isActive={() => false}>
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
              onSubmit={this.onDishUpdate}
              className="app-form"
            >
              <DishForm categories={categories} ref={this.formResults} />
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
