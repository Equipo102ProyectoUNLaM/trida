import React from 'react';
import { Card, CardBody, CardTitle } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { ContextMenuTrigger } from 'react-contextmenu';
import { Colxx } from 'components/common/CustomBootstrap';

export default class Inicio extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      instId: this.props.itemId,
    };
  }

  showCourses = () => {
    this.props.showChildren(this.state.instId);
  };

  render() {
    const { itemId, item } = this.props;
    return (
      <Colxx sm="12" lg="8" xl="6" className="mb-4">
        <NavLink className="subject" onClick={this.showCourses} to="#">
          <ContextMenuTrigger id="menu_id" data={itemId}>
            <Card className="card-inicio">
              <CardBody className="card-body">
                <CardTitle className="mb-4">{item.name}</CardTitle>
              </CardBody>
            </Card>
          </ContextMenuTrigger>
        </NavLink>
      </Colxx>
    );
  }
}
