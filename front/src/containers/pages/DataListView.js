import React from 'react';
import { Card, Row } from 'reactstrap';
import classnames from 'classnames';
import { ContextMenuTrigger } from 'react-contextmenu';
import { Colxx } from '../../components/common/CustomBootstrap';
import { NavLink } from 'react-router-dom';
import Calendario from 'components/common/Calendario';
import { injectIntl } from 'react-intl';
import { editDocument } from 'helpers/Firebase-db';

class DataListView extends React.Component {
  handleClick = async (date) => {
    if (date) {
      const obj = { fechaVencimiento: date.format('YYYY-MM-DD') };
      if (date) {
        await editDocument('practicas', this.props.id, obj, 'Práctica');
      }
    }
  };

  handleClickDelete = () => {
    this.props.onDelete(this.props.id);
  };

  render() {
    const {
      id,
      title,
      text1,
      text2,
      isSelect,
      collect,
      onEditItem,
      navTo,
      calendario,
      onDelete,
    } = this.props;
    return (
      <Colxx xxs="12" className="mb-3">
        <ContextMenuTrigger id="menu_id" data={id} collect={collect}>
          <Card
            className={classnames('d-flex flex-row', {
              active: isSelect,
            })}
          >
            <div className="pl-2 d-flex flex-grow-1 min-width-zero">
              <NavLink to={`${navTo}`} className="w-90 w-sm-100 active">
                <div className="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
                  <p className="list-item-heading mb-1 truncate">{title}</p>
                  {text1 && (
                    <p className="mb-1 text-small w-15 w-sm-100">{text1}</p>
                  )}
                  {text2 && (
                    <p className="mb-1 text-small w-15 w-sm-100">{text2}</p>
                  )}
                </div>
              </NavLink>
              <div className="custom-control custom-checkbox pl-1 align-self-center pr-4">
                <Row>
                  {onEditItem && (
                    <div
                      className="glyph-icon simple-icon-pencil edit-action-icon"
                      onClick={() => onEditItem(id)}
                    />
                  )}
                  {onDelete && (
                    <div
                      className="glyph-icon simple-icon-trash delete-action-icon"
                      onClick={this.handleClickDelete}
                    />
                  )}
                  {calendario && (
                    <Calendario
                      handleClick={this.handleClick}
                      text="Modificar fecha de entrega"
                      evalCalendar={false}
                    />
                  )}
                </Row>
              </div>
            </div>
          </Card>
        </ContextMenuTrigger>
      </Colxx>
    );
  }
}

export default injectIntl(DataListView);
