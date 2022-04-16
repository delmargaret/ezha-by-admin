import React, { Component } from "react";
import { Form, Row, Col, Nav } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import { LinkContainer } from "react-router-bootstrap";

import { STATUSES } from "./catering-facilities-statuses";
import CateringFacilitiesService from "../../services/catering-facilities-service";

import emptyIcon from "./../../empty.png";

const { SearchBar } = Search;

export default class CateringFacilitiesList extends Component {
  constructor(props) {
    super(props);

    this.changeStatus = this.changeStatus.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
  }

  changeStatus(e, id) {
    const status = e.target.checked ? STATUSES.Active : STATUSES.Disabled;
    CateringFacilitiesService.changeStatus(id, status);
  }

  renderDisableButton(cateringFacility) {
    return (
      <div>
        <Form.Check
          type="switch"
          label="Активно"
          className="app-switch"
          id={cateringFacility.id}
          onChange={(e) => this.changeStatus(e, cateringFacility.id)}
          defaultChecked={
            cateringFacility.cateringFacilityStatus === STATUSES.Active
          }
        />
      </div>
    );
  }

  handleImageChange(e, id) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      CateringFacilitiesService.updateIcon(id, reader.result);
    };

    reader.readAsDataURL(file);
  }

  renderIcon(url, id) {
    const iconUrl = url === "" ? emptyIcon : url;
    return (
      <div>
        <label>
          <input
            hidden={true}
            type="file"
            id="file"
            accept=".png, .jpg, .jpeg"
            onChange={(e) => this.handleImageChange(e, id)}
          />
          <div
            className="img-background"
            style={{ backgroundImage: `url(${iconUrl})` }}
          ></div>
        </label>
        <span
          className="close"
          onClick={() => {
            CateringFacilitiesService.updateIcon(id, "");
          }}
        >
          x
        </span>
      </div>
    );
  }

  render() {
    const columns = [
      {
        dataField: "id",
        text: "ID",
        hidden: true,
      },
      {
        dataField: "cateringFacilityName",
        text: "Заведения",
        align: "left",
        headerAlign: "left",
        sort: true,
        formatter: (cellContent, row) => {
          return (
            <LinkContainer to={`/catering-facilities/edit/${row.id}`}>
              <Nav.Link className="app-link">{cellContent}</Nav.Link>
            </LinkContainer>
          );
        },
      },
      {
        dataField: "cateringFacilityIconUrl",
        text: "Иконка",
        formatter: (cellContent, row) => {
          return this.renderIcon(cellContent, row.id);
        },
      },
      {
        dataField: "cateringFacilityStatus",
        text: "Статус",
        sort: true,
        formatter: (cellContent, row) => {
          return this.renderDisableButton(row);
        },
      },
    ];

    return (
      <ToolkitProvider
        keyField="id"
        data={this.props.cateringFacilities}
        columns={columns}
        search
      >
        {(props) => (
          <React.Fragment>
            <hr />
            <br />
            <Row>
              <Col xs="4">
                {" "}
                <SearchBar {...props.searchProps} placeholder="Поиск" />
              </Col>
            </Row>
            <BootstrapTable
              {...props.baseProps}
              bootstrap4
              hover={true}
              noDataIndication="Заведения не найдены"
            />
          </React.Fragment>
        )}
      </ToolkitProvider>
    );
  }
}
