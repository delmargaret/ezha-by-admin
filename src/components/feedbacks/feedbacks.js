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

import Emitter from "../../services/event-emitter";
import FeedbacksService, {
  FEEDBACK_LIST_UPDATED,
} from "../../services/feedbacks-service";
import { FEEDBACK_STATUSES } from "./feedback-statuses";
import { FEEDBACK_CATEGORIES } from "./feedback-categories";

import checkmark from "./../../checkmark.png";
import mail from "./../../mail.png";

const { SearchBar } = Search;

export default class FeedbacksPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      feedbacks: [],
      show: false,
      currentFeedback: {},
      currentStatus: null,
    };

    this.getFeedbacks = this.getFeedbacks.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
    this.sendEmail = this.sendEmail.bind(this);
    this.setShow = this.setShow.bind(this);
    this.subjectInput = React.createRef();
    this.bodyInput = React.createRef();
  }

  componentDidMount() {
    this.getFeedbacks();
    Emitter.on(FEEDBACK_LIST_UPDATED, (_) => this.getFeedbacks());
  }

  async getFeedbacks() {
    const feedbackList = await FeedbacksService.getFeedbacks();

    this.setState({ feedbacks: feedbackList ? feedbackList.data : []});
  }

  setShow(show) {
    this.setState({ show: show });
  }

  changeStatus(feedback, status) {
    this.setState({
      currentFeedback: feedback,
      currentStatus: status,
      show: true,
    });
  }

  sendEmail(id, status, email) {
    FeedbacksService.sendEmail(
      email,
      this.subjectInput.current.value,
      this.bodyInput.current.value
    );
    FeedbacksService.changeFeedbackStatus(id, status);
    this.setShow(false);
  }

  renderFeedbackButton(feedback) {
    switch (feedback.feedbackStatus) {
      case FEEDBACK_STATUSES.New:
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
                    FeedbacksService.changeFeedbackStatus(
                      feedback.id,
                      FEEDBACK_STATUSES.Processed
                    )
                  }
                >
                  <img alt="" width="24px" src={checkmark} />
                </Button>
              </OverlayTrigger>

              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip>Ответить</Tooltip>}
              >
                <Button
                  variant="outline-danger"
                  className="reject"
                  onClick={() =>
                    this.changeStatus(feedback, FEEDBACK_STATUSES.Processed)
                  }
                >
                  <img alt="" width="24px" src={mail} />
                </Button>
              </OverlayTrigger>
            </ButtonGroup>
          </React.Fragment>
        );
      case FEEDBACK_STATUSES.Processed:
        return <div>Обработан</div>;
      default:
        return "";
    }
  }

  render() {
    const feedback = this.state.currentFeedback;
    let type = FEEDBACK_CATEGORIES.find(
      (type) => type.id === feedback.feedbackCategory
    );

    const columns = [
      {
        dataField: "id",
        text: "ID",
        hidden: true,
      },
      {
        dataField: "feedbackCategory",
        text: "Тип",
        align: "left",
        headerAlign: "left",
        sort: true,
        formatter: (cellContent, row) => {
          return FEEDBACK_CATEGORIES.find((type) => type.id === cellContent)
            .name;
        },
      },
      {
        dataField: "cateringFacility.cateringFacilityName",
        text: "Заведение",
        align: "left",
        headerAlign: "left",
        sort: true,
      },
      {
        dataField: "userName",
        isDummyField: true,
        text: "Имя пользователя",
        sort: true,
        formatter: (cellContent, row) => {
          return `${row.surname} ${row.name} ${row.patronymic}`;
        },
      },
      {
        dataField: "email",
        text: "Почта",
        align: "left",
        headerAlign: "left",
      },
      {
        dataField: "text",
        text: "Содержание",
        hidden: true,
      },
      {
        dataField: "feedbackStatus",
        text: "Статус",
        sort: true,
        formatter: (cellContent, row) => {
          return this.renderFeedbackButton(row);
        },
      },
    ];

    const expandRow = {
      onlyOneExpanding: true,
      renderer: (row) => <React.Fragment>{row.text}</React.Fragment>,
    };

    const { show } = this.state;

    return (
      <React.Fragment>
        <br />
        <br />
        <ToolkitProvider
          keyField="id"
          data={this.state.feedbacks}
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
                noDataIndication="Запросы не найдены"
                expandRow={expandRow}
              />
            </React.Fragment>
          )}
        </ToolkitProvider>

        <Modal show={show} onHide={() => this.setShow(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Обратная связь</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div>
              <p>Тип: {type ? type.name : ""}</p>
              <p>Email: {feedback.email}</p>
              <Row>
                <Col sm="2">Subject:</Col>
                <Col>
                  <Form.Group>
                    <Form.Control ref={this.subjectInput} type="text" />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="app-form">
                    <Form.Control
                      ref={this.bodyInput}
                      as="textarea"
                      defaultValue={`Здравствуйте, ${feedback.name} ${feedback.patronymic}! \n`}
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
                  feedback.id,
                  this.state.currentStatus,
                  feedback.email
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
