import React, { Component } from "react";
import { Button, OverlayTrigger, Tooltip, Row, Col } from "react-bootstrap";
import TagsService from "../../services/tags-service";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";

const { SearchBar } = Search;

export default class TagsList extends Component {
  onDeleteTag(tagId) {
    TagsService.deleteTag(tagId);
  }

  onAfterSaveTag(oldValue, newValue, row, column) {
    TagsService.updateTagName(row.id, newValue);
  }

  renderRemoveButton(tag) {
    return tag.isAssigned ? (
      <OverlayTrigger
        key="right"
        placement="right"
        overlay={<Tooltip id={`tooltip-right`}>Тэг назначен заведению</Tooltip>}
      >
        <span>
          <Button
            variant="outline-danger"
            disabled
            style={{ pointerEvents: "none" }}
          >
            Удалить
          </Button>
        </span>
      </OverlayTrigger>
    ) : (
      <Button onClick={() => this.onDeleteTag(tag.id)} variant="outline-danger">
        Удалить
      </Button>
    );
  }

  render() {
    const columns = [
      {
        dataField: "id",
        text: "ID",
        hidden: true
      },
      {
        dataField: "tagName",
        text: "Тэги",
        align: "left",
        headerAlign: "left",
        sort: true,
        validator: (newValue, row, column) => {
          if (newValue.length === 0) {
            return {
              valid: false,
              message: "Введите название"
            };
          }
          return true;
        }
      },
      {
        dataField: "remove",
        isDummyField: true,
        text: "",
        formatter: (cellContent, row) => {
          return this.renderRemoveButton(row);
        },
        editable: false
      }
    ];

    return (
      <ToolkitProvider
        keyField="id"
        data={this.props.tags}
        columns={columns}
        search
      >
        {props => (
          <React.Fragment>
            <hr />
            <br />
            <Row>
              <Col xs="4">
                {" "}
                <SearchBar
                  {...props.searchProps}
                  placeholder="Поиск"
                />
              </Col>
            </Row>
            <BootstrapTable
              {...props.baseProps}
              bootstrap4
              hover={true}
              cellEdit={cellEditFactory({
                mode: "dbclick",
                afterSaveCell: this.onAfterSaveTag,
                autoSelectText: true
              })}
              noDataIndication="Тэги не найдены"
            />
          </React.Fragment>
        )}
      </ToolkitProvider>
    );
  }
}
