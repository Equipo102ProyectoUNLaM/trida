import React from 'react';
import {
  Row,
  Card,
  CardBody,
  CardTitle,
  CardImg,
  CardText,
  Badge,
} from 'reactstrap';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';
import { ContextMenuTrigger } from 'react-contextmenu';
import { Colxx } from 'components/common/CustomBootstrap';

const ListaConImagen = ({ item, isSelect, collect, navTo }) => {
  return (
    <Colxx sm="6" lg="4" xl="3" className="mb-3" key={item.id}>
      <ContextMenuTrigger id="menu_id" data={item.id} collect={collect}>
        <Card className="card-img-top">
          <div className="position-relative">
            <NavLink
              to={{
                pathname: `${navTo}`,
                navProps: {
                  itemId: item.id,
                },
              }}
              className="w-40 w-sm-100"
            >
              <CardImg
                top
                className="card-img-fluid"
                alt={item.nombre}
                src={item.imagen}
              />
            </NavLink>
          </div>
          <CardBody className="card-body">
            <Row>
              <Colxx xxs="10" className="mb-3">
                <CardTitle className="mb-1">{item.nombre}</CardTitle>
                <CardText className="text-muted text-small mb-3 font-weight-light">
                  {item.descripcion}
                </CardText>
                <CardText className="text-muted text-medium mb-0 font-weight-semibold">
                  {item.fecha}
                </CardText>
              </Colxx>
            </Row>
          </CardBody>
        </Card>
      </ContextMenuTrigger>
    </Colxx>
  );
};

/* React.memo detail : https://reactjs.org/docs/react-api.html#reactpurecomponent  */
export default React.memo(ListaConImagen);
