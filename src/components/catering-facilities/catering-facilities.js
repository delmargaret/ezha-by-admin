import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import CateringFacilitiesList from "./catering-facilities-list";
import CateringFacilitiesService, {
  CF_LIST_UPDATED,
} from "../../services/catering-facilities-service";
import Emitter from "../../services/event-emitter";

export default class CateringFacilitiesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cateringFacilities: [],
      isLoading: false,
    };

    this.getCateringFacilities = this.getCateringFacilities.bind(this);
  }

  async getCateringFacilities() {
    document.getElementById("loader-div").classList.remove("disabled");
    this.setState({ isLoading: true });
    const cateringFacilitiesList =
      await CateringFacilitiesService.getCateringFacilities();

    this.setState({
      cateringFacilities: cateringFacilitiesList
        ? cateringFacilitiesList.data
        : [],
      isLoading: false,
    });
    document.getElementById("loader-div").classList.add("disabled");
  }

  componentDidMount() {
    this.getCateringFacilities();
    Emitter.on(CF_LIST_UPDATED, (_) => this.getCateringFacilities());
  }

  componentWillUnmount() {
    Emitter.off(CF_LIST_UPDATED);
  }

  showLoader() {
    if (this.state.isLoading) {
      return (
        <div className="main-spinner spinner-border text-danger" role="status">
          <span className="visually-hidden"></span>
        </div>
      );
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.showLoader()}
        <br />
        <br />
        <LinkContainer to="/catering-facilities/new" isActive={() => false}>
          <Button className="btn-red">Добавить заведение</Button>
        </LinkContainer>
        <br />
        <div id="catering-facilities-list">
          <CateringFacilitiesList
            cateringFacilities={this.state.cateringFacilities}
          />
        </div>
      </React.Fragment>
    );
  }
}
