import React from "react";
import {
  Row,
  Card,
  CardBody,
  CardSubtitle,
  CardText,
  Badge
} from "reactstrap";
import { NavLink } from "react-router-dom";
import classnames from "classnames";
import { ContextMenuTrigger } from "react-contextmenu";
import { Colxx } from "../../components/common/CustomBootstrap";

const InstitutionListView = ({ institution, isSelect, collect, onCheckItem, navTo }) => {
  return (
    <Colxx sm="6" lg="4" xl="3" className="mb-3" key={institution.id}>
      <ContextMenuTrigger id="menu_id" data={institution.id} collect={collect}>
        <NavLink to={`${navTo}`} className="w-40 w-sm-100">
          <Card
            className={classnames({
              active: isSelect
            })}
          >
            <div className="position-relative">

              <Badge
                color="primary"
                pill
                className="position-absolute badge-top-left"
              >
                {institution.level}
              </Badge>
            </div>
            <CardBody>
              <Row>
                <Colxx xxs="10" className="mb-3">
                  <CardSubtitle></CardSubtitle>
                  <h5>{institution.name}</h5>

                  <CardText className="text-muted text-small mb-0 font-weight-light">
                    {institution.number_of_courses} CURSOS
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
export default React.memo(InstitutionListView);
