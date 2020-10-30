import { chunk } from 'lodash';
import * as React from 'react';
import { Col, Row, Grid } from 'react-flexbox-grid';
import { createRandomString } from 'helpers/Utils';

export default class GridGenerator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      colWidth: 12 / this.props.cols,
      rows: chunk(React.Children.toArray(this.props.children), this.props.cols),
    };
  }

  render() {
    const { colWidth, rows } = this.state;
    return (
      <Grid>
        {rows.map((cols) => (
          <Row key={createRandomString()}>
            {cols.map((col) => (
              <Col key={createRandomString()} sm={12} md={colWidth}>
                {col}
              </Col>
            ))}
          </Row>
        ))}
      </Grid>
    );
  }
}
