import React from 'react';
import DatePicker from 'react-datepicker';
import { DropdownMenu, Button, ModalFooter, ModalHeader } from 'reactstrap';
import { injectIntl } from 'react-intl';
import 'react-datepicker/dist/react-datepicker.css';

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
  };

  render() {
    const {
      text,
      evalCalendar,
      dateFormat,
      timeFormat,
      timeCaption,
      timeIntervals,
    } = this.props;
    const classText = evalCalendar ? '-eval' : '';
    return (
      <div>
        <div
          className={
            'glyph-icon simple-icon-calendar set-date-action-icon' +
            classText +
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
          />
          <ModalFooter>
            <Button color="primary" className="button" onClick={this.onConfirm}>
              Confirmar
            </Button>
            <Button
              color="primary"
              className="button"
              onClick={this.handleClick}
            >
              Cancelar
            </Button>
          </ModalFooter>
        </DropdownMenu>
      </div>
    );
  }
}
export default injectIntl(Calendario);
