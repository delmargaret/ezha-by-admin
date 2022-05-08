import React, { Component } from "react";

import TagsService, { TAG_LIST_UPDATED } from "../../services/tags-service";
import TagsList from "./tags-list";
import AddTagForm from "./add-tag-form";
import Emitter from "../../services/event-emitter";

import "./tags.css";

export default class TagsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: [],
      isLoading: false,
    };

    this.getTags = this.getTags.bind(this);
  }

  async getTags() {
    document.getElementById("loader-div").classList.remove("disabled");
    this.setState({ isLoading: true });
    const tags = await TagsService.getTags();

    this.setState({ tags: tags ? tags.data : [], isLoading: false });
    document.getElementById("loader-div").classList.add("disabled");
  }

  componentDidMount() {
    this.getTags();
    Emitter.on(TAG_LIST_UPDATED, () => this.getTags());
  }

  componentWillUnmount() {
    Emitter.off(TAG_LIST_UPDATED);
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

        <AddTagForm />
        <div id="tags-list">
          <TagsList tags={this.state.tags} />
        </div>
      </React.Fragment>
    );
  }
}
