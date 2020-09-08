import React from 'react';
import { Card } from 'reactstrap';
import classnames from 'classnames';
import { ContextMenuTrigger } from 'react-contextmenu';
import { Colxx } from '../../components/common/CustomBootstrap';
import { NavLink } from 'react-router-dom';
import { injectIntl } from 'react-intl';

class DataListEventos extends React.Component {
  render() {
    const { id, title, isSelect, navTo } = this.props;
    return (
      <Colxx xxs="12" className="mb-3">
        <ContextMenuTrigger id="menu_id" data={id}>
          <Card
            className={classnames('d-flex flex-row', {
              active: isSelect,
            })}
          >
            <div className="pl-2 d-flex flex-grow-1 min-width-zero">
              <NavLink to={`${navTo}`} className="w-90 w-sm-100 active">
                <div className="card-title-evento align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
                  <p className="list-item-heading mb-1 truncate">{title}</p>
                  <i className="simple-icon-arrow-right-circle" />
                </div>
              </NavLink>
            </div>
          </Card>
        </ContextMenuTrigger>
      </Colxx>
    );
  }
}

export default injectIntl(DataListEventos);
