import React from 'react';
import { Card, Row } from 'reactstrap';
import classnames from 'classnames';
import { ContextMenuTrigger } from 'react-contextmenu';
import { Colxx } from '../../components/common/CustomBootstrap';
import { NavLink } from 'react-router-dom';
import Calendario from 'components/common/Calendario';
import { injectIntl } from 'react-intl';
import { firestore } from 'helpers/Firebase';
import 'react-datepicker/dist/react-datepicker.css';

class DataListView extends React.Component {
  handleClick = (date) => {
    if (date) {
      const fecha = date.format('YYYY-MM-DD');
      var ref = firestore.collection('practicas').doc(this.props.id);
      // solo  modifica el campo con la nueva fecha de vencimiento
      ref.set(
        {
          fechaVencimiento: fecha,
        },
        { merge: true }
      );

      return;
    }
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
      onDeleteItem,
      navTo,
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
                  <p className="mb-1 text-small w-15 w-sm-100">{text1}</p>
                  <p className="mb-1 text-small w-15 w-sm-100">{text2}</p>
                </div>
              </NavLink>
              <div className="custom-control custom-checkbox pl-1 align-self-center pr-4">
                <Row>
                  <div
                    className="glyph-icon simple-icon-pencil edit-action-icon"
                    onClick={() => onEditItem(id)}
                  />
                  <div
                    className="glyph-icon simple-icon-trash delete-action-icon"
                    onClick={onDeleteItem}
                  />
                  <Calendario
                    handleClick={this.handleClick}
                    text="Modificar fecha de entrega"
                  />
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
