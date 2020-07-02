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
        <Card
          className={classnames({
            active: isSelect,
          })}
        >
          <div className="position-relative">
            <NavLink to={`${navTo}`} className="w-40 w-sm-100">
              <CardImg top alt={item.nombre} src={item.imagen} />
            </NavLink>
          </div>
          <CardBody>
            <Row>
              <Colxx xxs="10" className="mb-3">
                <CardTitle>{item.nombre}</CardTitle>
                <CardText className="text-muted text-small mb-0 font-weight-light">
                  {item.descripcion}
                </CardText>
                <CardText className="text-muted text-small mb-0 font-weight-light">
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
