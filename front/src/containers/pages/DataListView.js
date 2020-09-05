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

  onDownloadFile = (file) => {
    window.open(file, '_blank');
  };

  render() {
    const {
      id,
      title,
      text1,
      text2,
      file,
      isSelect,
      collect,
      onEditItem,
      navTo,
      calendario,
      onDelete,
      onUploadFile,
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
                  <p className="list-item-heading mb-1 truncate practicas-list-label">
                    {title}
                  </p>
                  {text1 && (
                    <p className="mb-1 text-small w-sm-100 practicas-list-label">
                      {text1}
                    </p>
                  )}
                  {text2 && (
                    <p className="mb-1 text-small w-sm-100 practicas-list-label">
                      {text2}
                    </p>
                  )}
                </div>
              </NavLink>
              <div className="custom-control custom-checkbox pl-1 align-self-center pr-4 practicas-list-label">
                <Row>
                  {file !== undefined && (
                    <div
                      className="glyph-icon simple-icon-cloud-download edit-action-icon"
                      onClick={() => this.onDownloadFile(file)}
                    />
                  )}
                  {onUploadFile && (
                    <div
                      className="glyph-icon simple-icon-upload edit-action-icon"
                      onClick={() => onUploadFile(id)}
                    />
                  )}
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
