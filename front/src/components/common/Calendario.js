import React from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
import { DropdownMenu, Button, ModalFooter, ModalHeader } from 'reactstrap';
import { injectIntl } from 'react-intl';
import 'react-datepicker/dist/react-datepicker.css';
registerLocale('es', es);

class Calendario extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      fecha: null,
      close: '',
    };
  }

  handleChange = (date) =>
    this.setState({
      fecha: date,
    });

  handleClick = (event) => {
    if (event.target === event.currentTarget) {
      const close = this.state.close === 'show' ? '' : 'show';

      this.setState({
        close,
      });
    }
  };

  onConfirm = () => {
    this.setState({
      close: '',
    });

    this.props.handleClick(this.state.fecha);

    this.setState({
      fecha: '',
    });
  };

  render() {
    const {
      text,
      evalCalendar,
      filterCalendar,
      dateFormat,
      timeFormat,
      timeCaption,
      timeIntervals,
      iconClass,
    } = this.props;
    const classText = evalCalendar ? '-eval' : '';
    const filterText = filterCalendar ? '-filter' : '';
    return (
      <div>
        <div
          style={{ margin: '0.2rem' }}
          className={
            'glyph-icon simple-icon-calendar set-date-action-icon' +
            iconClass +
            classText +
            filterText +
            ' relative'
          }
          onClick={this.handleClick}
        ></div>
        <DropdownMenu
          className={'dropdown-menu-calendar ' + this.state.close}
          right
          id="iconMenuDropdown"
        >
          <ModalHeader className="margin-auto">
            <p className="mb-1">{text}</p>
          </ModalHeader>
          <DatePicker
            className="react-datepicker"
            inline
            id={this.props.id}
            selected={this.state.fecha}
            onChange={this.handleChange}
            peekNextMonth={true}
            dateFormat={dateFormat ? dateFormat : 'DD/MM/YYYY'}
            showTimeSelect={timeFormat ? true : false}
            timeFormat={timeFormat ? timeFormat : null}
            timeCaption={timeCaption ? timeCaption : null}
            timeIntervals={timeIntervals ? timeIntervals : null}
            dropdownMode="select"
            defaultValue={null}
            locale="es"
          />
          <ModalFooter>
            <Button
              color="primary"
              className="button"
              onClick={this.handleClick}
            >
              Cancelar
            </Button>
            <Button color="primary" className="button" onClick={this.onConfirm}>
              Confirmar
            </Button>
          </ModalFooter>
        </DropdownMenu>
      </div>
    );
  }
}
export default injectIntl(Calendario);
