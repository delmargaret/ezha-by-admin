import React, { Component } from "react";
import { Form } from "react-bootstrap";

import CateringFacilitiesService from "../../services/catering-facilities-service";
import AddCategoryForm from "./add-category";
import CategoriesList from "./categories-list";
import Emitter from "../../services/event-emitter";
import CategoriesService, {
  CATEGORIES_LIST_UPDATED
} from "../../services/categories-service";

export default class CategoriesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cateringFacilities: [],
      categories: [],
      cateringFacilityId: "-1"
    };

    this.getCateringFacilities = this.getCateringFacilities.bind(this);
    this.getCategories = this.getCategories.bind(this);
    this.onCateringFacilityChange = this.onCateringFacilityChange.bind(this);
  }

  async getCateringFacilities() {
    const cateringFacilitiesList = await CateringFacilitiesService.getCateringFacilities();

    this.setState({
      cateringFacilities: cateringFacilitiesList ? cateringFacilitiesList.data.map(res => {
        return { id: res.id, name: res.cateringFacilityName };
      }) : []
    });
  }

  async getCategories(id) {
    if (id && id !== "-1") {
      const categoriesData = await CategoriesService.getCategories(id);

      this.setState({ categories: categoriesData ? categoriesData.data : [] });
    }
  }

  componentDidMount() {
    this.getCateringFacilities();
    this.getCategories(this.state.cateringFacilityId);
    Emitter.on(CATEGORIES_LIST_UPDATED, _ =>
      this.getCategories(this.state.cateringFacilityId)
    );
  }

  componentWillUnmount() {
    Emitter.off(CATEGORIES_LIST_UPDATED);
  }

  renderCateringFacilityOptions() {
    return this.state.cateringFacilities.map(it => (
      <option key={it.id} value={it.id}>
        {it.name}
      </option>
    ));
  }

  renderCategoriesForm() {
    let id = this.state.cateringFacilityId;

    if (id && id !== "-1") {
      return (
        <div>
          <AddCategoryForm cateringFacilityId={this.state.cateringFacilityId} />
          <CategoriesList
            cateringFacilityId={this.state.cateringFacilityId}
            categories={this.state.categories}
          />
        </div>
      );
    }
    if (this.state.cateringFacilities.length === 0) {
      return <div>Заведения отсутствуют</div>;
    }
    return <div>Заведение не выбрано</div>;
  }

  onCateringFacilityChange(event) {
    this.setState({ cateringFacilityId: event.target.value });
    this.getCategories(event.target.value);
  }

  render() {
    return (
      <React.Fragment>
        <br />
        <Form.Group>
          <Form.Label>Заведение</Form.Label>
          <Form.Control
            as="select"
            disabled={this.state.cateringFacilities.length === 0}
            onChange={this.onCateringFacilityChange}
          >
            <option key={-1} value={-1}>
              Выберите заведение
            </option>
            {this.renderCateringFacilityOptions()}
          </Form.Control>
        </Form.Group>
        <hr />
        {this.renderCategoriesForm()}
      </React.Fragment>
    );
  }
}
