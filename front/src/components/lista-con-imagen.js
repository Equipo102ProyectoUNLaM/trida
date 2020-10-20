import React from 'react';
import { Row, Card, CardBody, CardTitle, CardImg, CardText } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { ContextMenuTrigger } from 'react-contextmenu';
import { Colxx } from 'components/common/CustomBootstrap';
import { getDateTimeStringFromDate } from 'helpers/Utils';

const ListaConImagen = ({
  item,
  imagen,
  collect,
  navTo,
  onEdit,
  onDelete,
  isClase,
}) => {
  const { data } = item;
  return (
    <Colxx sm="6" lg="4" xl="3" className="mb-3" key={item.id}>
      <ContextMenuTrigger id="menu_id" data={item.id} collect={collect}>
        <Card className="card-img-top">
          <NavLink
            to={{
              pathname: `${navTo}`,
              navProps: {
                itemId: item.id,
              },
            }}
          >
            <div className="position-relative">
              <CardImg
                top
                className="card-img-fluid"
                alt={data.nombre}
                src={imagen}
              />
            </div>
          </NavLink>
          <CardBody className="card-body">
            <NavLink
              to={{
                pathname: `${navTo}`,
                navProps: {
                  itemId: item.id,
                },
              }}
              className="w-40 w-sm-100"
            >
              <Row>
                <Colxx xxs="10" className="mb-3">
                  <CardTitle className="mb-1">{data.nombre}</CardTitle>
                  <CardText className="text-muted text-small mb-3 font-weight-light">
                    {data.descripcion}
                  </CardText>
                  <CardText className="text-muted text-medium mb-0 font-weight-semibold">
                    {isClase
                      ? getDateTimeStringFromDate(data.fecha_clase)
                      : data.fecha_creacion}
                  </CardText>
                </Colxx>
              </Row>
            </NavLink>

            <Row className="button-group">
              {onEdit && (
                <div
                  className="glyph-icon simple-icon-pencil edit-action-icon"
                  onClick={() => onEdit(item.id)}
                />
              )}
              {onDelete && (
                <div
                  className="glyph-icon simple-icon-trash delete-action-icon"
                  onClick={() => onDelete(item.id)}
                />
              )}
            </Row>
          </CardBody>
        </Card>
      </ContextMenuTrigger>
    </Colxx>
  );
};

/* React.memo detail : https://reactjs.org/docs/react-api.html#reactpurecomponent  */
export default React.memo(ListaConImagen);
