import React, { Component } from 'react';
import { Button, OverlayTrigger, Tooltip, Row, Col } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import CategoriesService from '../../services/categories-service';

const { SearchBar } = Search;

export default class CategoriesList extends Component {
  constructor(props) {
    super(props);

    this.onAfterSaveCategory = this.onAfterSaveCategory.bind(this);
  }

  onDeleteCategory(categoryId) {
    CategoriesService.deleteCategory(this.props.cateringFacilityId, categoryId);
  }

  onAfterSaveCategory(oldValue, newValue, row, column) {
    CategoriesService.updateCategoryName(this.props.cateringFacilityId, row.categoryId, newValue);
  }

  renderRemoveButton(category) {
    return category.isAssigned ? (
      <OverlayTrigger
        key="right"
        placement="right"
        overlay={<Tooltip id={`tooltip-right`}>Категория назначена блюду</Tooltip>}
      >
        <span>
          <Button
            variant="outline-danger"
            disabled
            style={{ pointerEvents: 'none' }}
          >
            Удалить
          </Button>
        </span>
      </OverlayTrigger>
    ) : (
      <Button onClick={() => this.onDeleteCategory(category.categoryId)} variant="outline-danger">
        Удалить
      </Button>
    );
  }

  render() {
    const columns = [
      {
        dataField: 'categoryId',
        text: 'ID',
        hidden: true
      },
      {
        dataField: 'categoryName',
        text: 'Категории',
        align: 'left',
        headerAlign: 'left',
        sort: true,
        validator: (newValue, row, column) => {
          if (newValue.length === 0) {
            return {
              valid: false,
              message: 'Введите название'
            };
          }
          return true;
        }
      },
      {
        dataField: 'remove',
        isDummyField: true,
        text: '',
        formatter: (cellContent, row) => {
          return this.renderRemoveButton(row);
        },
        editable: false
      }
    ];

    return (
      <ToolkitProvider
        keyField="categoryId"
        data={this.props.categories}
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
                mode: 'dbclick',
                afterSaveCell: this.onAfterSaveCategory,
                autoSelectText: true
              })}
              noDataIndication="Категории не найдены"
            />
          </React.Fragment>
        )}
      </ToolkitProvider>
    );
  }
}
