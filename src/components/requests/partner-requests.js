import React, { Component } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";

import {
  Row,
  Col,
  Button,
  Form,
  Modal,
  ButtonGroup,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";

import { REQUEST_STATUSES } from "./request-statuses";
import { TYPES } from "../catering-facility-types";
import RequestsService, {
  PARTNER_LIST_UPDATED,
} from "../../services/requests-service";
import Emitter from "../../services/event-emitter";

import checkmark from "./../../checkmark.png";
import cross from "./../../cross.png";
import CateringFacilitiesService from "../../services/catering-facilities-service";

const { SearchBar } = Search;

export default class PartnerRequestsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: [],
      show: false,
      currentPartner: {},
      currentStatus: null,
      cateringFacilities: [],
    };

    this.getPartnerRequests = this.getPartnerRequests.bind(this);
    this.renderPartnerAccountButton = this.renderPartnerAccountButton.bind(
      this
    );
    this.getCateringFacilities = this.getCateringFacilities.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
    this.sendEmail = this.sendEmail.bind(this);
    this.setShow = this.setShow.bind(this);
    this.subjectInput = React.createRef();
    this.bodyInput = React.createRef();
    this.cateringFacility = React.createRef();
  }

  componentDidMount() {
    this.getPartnerRequests();
    this.getCateringFacilities();
    Emitter.on(PARTNER_LIST_UPDATED, (_) => this.getPartnerRequests());
  }

  async getPartnerRequests() {
    const requestList = await RequestsService.getPartnerRequests();

    this.setState({ requests: requestList ? requestList.data : [] });
  }

  async getCateringFacilities() {
    const cateringFacilitiesList = await CateringFacilitiesService.getCateringFacilities();

    this.setState({
      cateringFacilities: cateringFacilitiesList
        ? cateringFacilitiesList.data
        : [],
    });
  }

  renderPartnerAccountButton(partner) {
    if (partner.isExists) {
      return (
        <Button
          style={{ fontSize: "14px" }}
          variant="outline-success"
          onClick={() => RequestsService.ResendPartnerPassword(partner.id)}
        >
          Повторно отправить пароль
        </Button>
      );
    }
    return (
      <React.Fragment>
        <Form.Control
          style={{ fontSize: "14px", marginBottom: "5px", cursor: "pointer" }}
          as="select"
          ref={this.cateringFacility}
        >
          {this.state.cateringFacilities.map((cafe) => (
            <option key={cafe.id} value={cafe.id}>
              {cafe.cateringFacilityName}
            </option>
          ))}
        </Form.Control>
        <Button
          style={{ fontSize: "14px" }}
          variant="outline-success"
          onClick={() =>
            RequestsService.AddPartnerAccount(
              partner.id,
              this.cateringFacility.current.value
            ).then((_) => this.getPartnerRequests())
          }
        >
          Создать аккаунт
        </Button>
      </React.Fragment>
    );
  }

  setShow(show) {
    this.setState({ show: show });
  }

  changeStatus(partner, status) {
    this.setState({
      currentPartner: partner,
      currentStatus: status,
      show: true,
    });
  }

  sendEmail(id, status, email) {
    RequestsService.sendEmail(
      email,
      this.subjectInput.current.value,
      this.bodyInput.current.value
    );
    RequestsService.changePartnerStatus(id, status);
    this.setShow(false);
  }

  renderRequestButton(partner) {
    switch (partner.requestStatus) {
      case REQUEST_STATUSES.New:
        return (
          <React.Fragment>
            <ButtonGroup>
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip>Принять</Tooltip>}
              >
                <Button
                  variant="outline-success"
                  className="accept"
                  onClick={() =>
                    this.changeStatus(partner, REQUEST_STATUSES.Accepted)
                  }
                >
                  <img alt="" width="24px" src={checkmark} />
                </Button>
              </OverlayTrigger>

              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip>Отклонить</Tooltip>}
              >
                <Button
                  variant="outline-danger"
                  className="reject"
                  onClick={() =>
                    this.changeStatus(partner, REQUEST_STATUSES.Rejected)
                  }
                >
                  <img alt="" width="24px" src={cross} />
                </Button>
              </OverlayTrigger>
            </ButtonGroup>
          </React.Fragment>
        );
      case REQUEST_STATUSES.Accepted:
        return <div>{this.renderPartnerAccountButton(partner)}</div>;
      case REQUEST_STATUSES.Rejected:
        return <div>Отклонен</div>;
      default:
        return "";
    }
  }

  render() {
    const requestStatus =
      this.state.currentStatus === REQUEST_STATUSES.Accepted
        ? "Принять"
        : "Отклонить";
    const partner = this.state.currentPartner;

    const columns = [
      {
        dataField: "id",
        text: "ID",
        hidden: true,
      },
      {
        dataField: "cateringFacilityName",
        text: "Заведение",
        align: "left",
        headerAlign: "left",
        sort: true,
      },
      {
        dataField: "cateringFacilityType",
        text: "Тип",
        align: "left",
        headerAlign: "left",
        sort: true,
        formatter: (cellContent, row) => {
          return TYPES.find((type) => type.id === cellContent).name;
        },
      },
      {
        dataField: "partnerName",
        isDummyField: true,
        text: "Имя партнера",
        sort: true,
        formatter: (cellContent, row) => {
          return `${row.surname} ${row.name} ${row.patronymic}`;
        },
      },
      {
        dataField: "phone",
        text: "Телефон",
        align: "left",
        headerAlign: "left",
      },
      {
        dataField: "email",
        text: "Почта",
        align: "left",
        headerAlign: "left",
      },
      {
        dataField: "requestStatus",
        text: "Статус",
        sort: true,
        formatter: (cellContent, row) => {
          return this.renderRequestButton(row);
        },
      },
    ];

    const { show } = this.state;

    return (
      <React.Fragment>
        <br />
        <br />
        <ToolkitProvider
          keyField="id"
          data={this.state.requests}
          columns={columns}
          search
        >
          {(props) => (
            <React.Fragment>
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
                noDataIndication="Заявки не найдены"
              />
            </React.Fragment>
          )}
        </ToolkitProvider>

        <Modal show={show} onHide={() => this.setShow(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{requestStatus}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div>
              <p>Заведение: {partner.cateringFacilityName}</p>
              <p>Email: {partner.email}</p>
              <Row>
                <Col sm="2">Subject:</Col>
                <Col>
                  <Form.Group>
                    <Form.Control
                      ref={this.subjectInput}
                      defaultValue={`Ваша заявка ${
                        requestStatus === "Принять" ? "принята" : "отклонена"
                      }`}
                      type="text"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="app-form">
                    <Form.Control
                      ref={this.bodyInput}
                      as="textarea"
                      defaultValue={`Здравствуйте, ${partner.name} ${partner.patronymic}! \n`}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button
              className="btn-red"
              onClick={() =>
                this.sendEmail(
                  partner.id,
                  this.state.currentStatus,
                  partner.email
                )
              }
            >
              Отправить
            </Button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
}
