import React, { Component } from 'react';
import { Button, Form, Col, Row } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

import DishesService from '../../services/dishes-service';
import DishForm from './dish-form';
import CategoriesService from '../../services/categories-service';
import arrowLeft from './../../arrow-left.png';

export default class AddDish extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categories: [],
      needRedirect: false,
      validated: false,
    };

    this.formResults = React.createRef();
    this.onDishSubmit = this.onDishSubmit.bind(this);
  }

  async onDishSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;
    let needRedirect = false;

    if (form.checkValidity()) {
      needRedirect = true;

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

      await DishesService.createDish(name, description, price, categoryId);
    }

    this.setState({
      needRedirect: needRedirect,
      validated: true,
    });
  }

  async componentDidMount() {
    const { cateringFacilityId } = this.props.match.params;

    const categoriesData = await CategoriesService.getCategories(cateringFacilityId);
    
    this.setState({
      categories: categoriesData ? categoriesData.data : [],
      needRedirect: false,
      validated: false,
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
              onSubmit={this.onDishSubmit}
              className="app-form"
            >
              <DishForm
                categories={categories}
                ref={this.formResults}
                categoryId={-1}
              />
              <Button type="submit" className="btn-red">
                Создать
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
