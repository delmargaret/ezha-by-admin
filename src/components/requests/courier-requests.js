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
import RequestsService, {
  COURIER_LIST_UPDATED,
} from "../../services/requests-service";
import Emitter from "../../services/event-emitter";
import { VEHICLE_TYPES } from "./vehicle-types";

import checkmark from "./../../checkmark.png";
import cross from "./../../cross.png";

const { SearchBar } = Search;

export default class CourierRequestsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      requests: [],
      show: false,
      currentCourier: {},
      currentStatus: null,
    };

    this.getCourierRequests = this.getCourierRequests.bind(this);
    this.renderCourierAccountButton = this.renderCourierAccountButton.bind(
      this
    );
    this.changeStatus = this.changeStatus.bind(this);
    this.sendEmail = this.sendEmail.bind(this);
    this.setShow = this.setShow.bind(this);
    this.subjectInput = React.createRef();
    this.bodyInput = React.createRef();
  }

  componentDidMount() {
    this.getCourierRequests();
    Emitter.on(COURIER_LIST_UPDATED, (_) => this.getCourierRequests());
  }

  async getCourierRequests() {
    const requestList = await RequestsService.getCourierRequests();

    this.setState({ requests: requestList ? requestList.data : [] });
  }

  renderCourierAccountButton(courier) {
    if (courier.isExists) {
      return (
        <Button
          style={{ fontSize: "14px" }}
          variant="outline-success"
          onClick={() => RequestsService.ResendCourierPassword(courier.id)}
        >
          Повторно отправить пароль
        </Button>
      );
    }
    return (
      <React.Fragment>
        <Button
          style={{ fontSize: "14px" }}
          variant="outline-success"
          onClick={() =>
            RequestsService.AddCourierAccount(courier.id).then((_) =>
              this.getCourierRequests()
            )
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

  changeStatus(courier, status) {
    this.setState({
      currentCourier: courier,
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
    RequestsService.changeCourierStatus(id, status);
    this.setShow(false);
  }

  renderRequestButton(courier) {
    switch (courier.requestStatus) {
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
                    this.changeStatus(courier, REQUEST_STATUSES.Accepted)
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
                    this.changeStatus(courier, REQUEST_STATUSES.Rejected)
                  }
                >
                  <img alt="" width="24px" src={cross} />
                </Button>
              </OverlayTrigger>
            </ButtonGroup>
          </React.Fragment>
        );
      case REQUEST_STATUSES.Accepted:
        return <div>{this.renderCourierAccountButton(courier)}</div>;
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

    const courier = this.state.currentCourier;

    const columns = [
      {
        dataField: "id",
        text: "ID",
        hidden: true,
      },
      {
        dataField: "courierName",
        isDummyField: true,
        text: "Имя курьера",
        sort: true,
        formatter: (cellContent, row) => {
          return `${row.surname} ${row.name} ${row.patronymic}`;
        },
      },
      {
        dataField: "vehicleType",
        text: "Тип транспорта",
        align: "left",
        headerAlign: "left",
        sort: true,
        formatter: (cellContent, row) => {
          return VEHICLE_TYPES.find((type) => type.id === cellContent).name;
        },
      },
      {
        dataField: "fuelConsumption",
        text: "Расход топлива",
        align: "left",
        headerAlign: "left",
        sort: true,
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
              <p>Email: {courier.email}</p>
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
                      defaultValue={`Здравствуйте, ${courier.name} ${courier.patronymic}! \n`}
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
                  courier.id,
                  this.state.currentStatus,
                  courier.email
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
