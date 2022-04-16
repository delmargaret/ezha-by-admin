import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";

import CateringFacilitiesService from "../../services/catering-facilities-service";
import Emitter from "../../services/event-emitter";
import DishesService, {
  DISHES_LIST_UPDATED,
} from "../../services/dishes-service";
import CategoriesService from "../../services/categories-service";

import DishesList from "./dishes-list";

export default class DishesPage extends Component {
  constructor(props) {
    super(props);

    const { cateringFacilityId } = props.match.params;

    this.state = {
      cateringFacilities: [],
      categories: [],
      dishes: [],
      cateringFacilityId: cateringFacilityId ? cateringFacilityId : "-1",
      needRedirect: false,
    };

    this.getCateringFacilities = this.getCateringFacilities.bind(this);
    this.getCategories = this.getCategories.bind(this);
    this.onCateringFacilitiesUpdate = this.onCateringFacilitiesUpdate.bind(
      this
    );
  }

  async getCateringFacilities() {
    const cateringFacilitiesList = await CateringFacilitiesService.getCateringFacilities();

    this.setState({
      cateringFacilities: cateringFacilitiesList ? cateringFacilitiesList.data.map((res) => {
        return { id: res.id, name: res.cateringFacilityName };
      }) : []
    });
  }

  async getCategories(cateringFacilityId) {
    if (cateringFacilityId && cateringFacilityId !== "-1") {
      const categoriesData = await CategoriesService.getCategories(
        cateringFacilityId
      );

      this.setState({ categories: categoriesData ? categoriesData.data : []});
    }
  }

  async getDishes(cateringFacilityId) {
    if (cateringFacilityId && cateringFacilityId !== "-1") {
      const dishesData = await DishesService.getDishes(cateringFacilityId);

      this.setState({ dishes: dishesData ? dishesData.data : []});
    }
  }

  onCateringFacilitiesUpdate(event) {
    this.setState({
      cateringFacilityId: event.target.value,
      needRedirect: true,
    });
  }

  componentDidMount() {
    const { cateringFacilityId } = this.state;

    this.getCateringFacilities();

    this.getDishes(cateringFacilityId);
    this.getCategories(cateringFacilityId);

    Emitter.on(DISHES_LIST_UPDATED, (_) =>
      this.getDishes(this.state.cateringFacilityId)
    );

    this.setState({
      needRedirect: false,
    });
  }

  componentWillUnmount() {
    Emitter.off(DISHES_LIST_UPDATED);
  }

  renderCateringFacilityOptions() {
    return this.state.cateringFacilities.map((it) => (
      <option key={it.id} value={it.id}>
        {it.name}
      </option>
    ));
  }

  renderDishesForm() {
    let id = this.state.cateringFacilityId;

    if (id && id !== "-1") {
      if (this.state.categories.length === 0) {
        return <React.Fragment>Категории отсутствуют</React.Fragment>;
      }

      return (
        <React.Fragment>
          <LinkContainer to={`/dishes/new/${id}`} isActive={() => false}>
            <Button className="btn-red">Добавить блюдо</Button>
          </LinkContainer>
          <hr />
          <br />
          <div id="dishes-list">
            <DishesList dishes={this.state.dishes} cateringFacilityId={id} />
          </div>
        </React.Fragment>
      );
    }

    if (this.state.cateringFacilities.length === 0) {
      return <React.Fragment>Заведения отсутствуют</React.Fragment>;
    }

    return <React.Fragment>Заведение не выбрано</React.Fragment>;
  }

  render() {
    const { cateringFacilityId, needRedirect } = this.state;

    const dishesCateringFacilityPage = `/dishes/catering-facility/${cateringFacilityId}`;

    const redirectElement = <Redirect to={dishesCateringFacilityPage} />;

    const pageElement = (
      <React.Fragment>
        <br />
        <Form.Group>
          <Form.Label>Заведение</Form.Label>
          <Form.Control
            as="select"
            value={cateringFacilityId}
            disabled={this.state.cateringFacilities.length === 0}
            onChange={this.onCateringFacilitiesUpdate}
          >
            <option key={-1} value={-1}>
              Выберите заведение
            </option>
            {this.renderCateringFacilityOptions()}
          </Form.Control>
        </Form.Group>
        <hr />
        {this.renderDishesForm()}
      </React.Fragment>
    );

    return needRedirect ? redirectElement : pageElement;
  }
}
