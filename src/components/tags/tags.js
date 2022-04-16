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
    };

    this.getTags = this.getTags.bind(this);
  }

  async getTags() {
    const tags = await TagsService.getTags();

    this.setState({ tags: tags ? tags.data : [] });
  }

  componentDidMount() {
    this.getTags();
    Emitter.on(TAG_LIST_UPDATED, () => this.getTags());
  }

  componentWillUnmount() {
    Emitter.off(TAG_LIST_UPDATED);
  }

  render() {
    return (
      <React.Fragment>
        <AddTagForm />
        <div id="tags-list">
          <TagsList tags={this.state.tags} />
        </div>
      </React.Fragment>
    );
  }
}
