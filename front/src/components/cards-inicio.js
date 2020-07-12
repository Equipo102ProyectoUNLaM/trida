import React from 'react';
import { Row, Card, CardBody, CardTitle, CardText } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { ContextMenuTrigger } from 'react-contextmenu';
import { Colxx } from 'components/common/CustomBootstrap';

export default class Inicio extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      instId: this.props.instId,
    };

    console.log(this.state);
  }

  showCourses = () => {
    this.props.showCourses(this.state.instId);
  };

  render() {
    const { instId, name } = this.props;
    return (
      <Colxx sm="12" lg="8" xl="6" className="mb-4">
        <NavLink className="subject" onClick={this.showCourses} to="#">
          <ContextMenuTrigger id="menu_id" data={instId}>
            <Card className="card-inicio">
              <CardBody className="card-body">
                <Row>
                  <Colxx xxs="16" className="mb-4">
                    <CardTitle className="mb-3">{name}</CardTitle>
                    <CardText className="text-muted text-small mb-3 font-weight-light">
                      test
                    </CardText>
                    <CardText className="text-muted text-medium mb-0 font-weight-semibold">
                      test
                    </CardText>
                  </Colxx>
                </Row>
              </CardBody>
            </Card>
          </ContextMenuTrigger>
        </NavLink>
      </Colxx>
    );
  }
}
