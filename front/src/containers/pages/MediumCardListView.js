import React from 'react';
import { Row, Card, CardBody, CardSubtitle, CardText, Badge } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';
import { ContextMenuTrigger } from 'react-contextmenu';
import { Colxx } from '../../components/common/CustomBootstrap';

const MediumCardListView = ({ item, isSelect, collect, navTo, onClick }) => {
  return (
    <Colxx sm="6" lg="4" xl="3" className="mb-3" key={item.id}>
      <ContextMenuTrigger id="menu_id" data={item.id} collect={collect}>
        <NavLink
          onClick={onClick ? onClick : ''}
          to={{
            pathname: `${navTo}`,
            navProps: {
              itemId: item.id,
            },
          }}
          className="w-40 w-sm-100"
        >
          <Card
            className={classnames({
              active: isSelect,
            })}
          >
            <div className="position-relative">
              {item.tags &&
                item.tags.map((tag, index) => {
                  return (
                    <Badge
                      key={index + 'badge'}
                      color="primary"
                      pill
                      className={
                        'position-absolute badge-top-right-' + (index + 1)
                      }
                    >
                      {tag}
                    </Badge>
                  );
                })}
            </div>
            <CardBody>
              <Row>
                <Colxx xxs="10" className="mb-3">
                  <CardSubtitle></CardSubtitle>
                  <h5>{item.name}</h5>

                  <CardText className="text-muted text-small mb-0 font-weight-light">
                    {item.description}
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
export default React.memo(MediumCardListView);
