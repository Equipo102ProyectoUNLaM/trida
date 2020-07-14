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

const ListaConImagen = ({ item, imagen, collect, navTo }) => {
  const { data } = item;
  return (
    <Colxx sm="6" lg="4" xl="3" className="mb-3" key={item.id}>
      <ContextMenuTrigger id="menu_id" data={item.id} collect={collect}>
        <NavLink
          to={{
            pathname: `${navTo}`,
            navProps: {
              itemId: item.id,
            },
          }}
          className="w-40 w-sm-100"
        >
          <Card className="card-img-top">
            <div className="position-relative">
              <CardImg
                top
                className="card-img-fluid"
                alt={data.nombre}
                src={imagen}
              />
            </div>
            <CardBody className="card-body">
              <Row>
                <Colxx xxs="10" className="mb-3">
                  <CardTitle className="mb-1">{data.nombre}</CardTitle>
                  <CardText className="text-muted text-small mb-3 font-weight-light">
                    {data.descripcion}
                  </CardText>
                  <CardText className="text-muted text-medium mb-0 font-weight-semibold">
                    {data.fecha}
                  </CardText>
                </Colxx>
              </Row>
            </CardBody>
          </Card>
        </NavLink>
      </ContextMenuTrigger>
    </Colxx>
  );
};

/* React.memo detail : https://reactjs.org/docs/react-api.html#reactpurecomponent  */
export default React.memo(ListaConImagen);
