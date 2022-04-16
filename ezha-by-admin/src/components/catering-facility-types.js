import React, { Component } from 'react';
import { Form } from 'react-bootstrap';

export const TYPES = [
  {
    id: 0,
    name: 'Кафе'
  },
  {
    id: 1,
    name: 'Ресторан'
  },
  {
    id: 2,
    name: 'Магазин'
  }
];

export default class CateringFacilityTypes extends Component {
  constructor(props) {
    super(props);

    this.type = React.createRef();
  }

  renderOptions() {
    return TYPES.map(type => <option key={type.id} value={type.id}>{type.name}</option>);
  }

  render() {
    return (
      <div>
        <Form.Group>
          <Form.Label>Тип заведения</Form.Label>
          <Form.Control as="select" ref={this.type}>
            {this.renderOptions()}
          </Form.Control>
        </Form.Group>
      </div>
    );
  }
}
