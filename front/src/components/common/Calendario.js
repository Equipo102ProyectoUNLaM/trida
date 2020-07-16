import React from 'react';
import DatePicker from 'react-datepicker';
import { DropdownMenu, Button, ModalFooter, ModalHeader } from 'reactstrap';
import { injectIntl } from 'react-intl';

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
    const { text, evalCalendar } = this.props;
    const classText = evalCalendar ? '-eval' : '';
    return (
      <div
        className={
          'glyph-icon simple-icon-calendar set-date-action-icon' +
          classText +
          ' relative'
        }
        onClick={this.handleClick}
      >
        <DropdownMenu
          className={'dropdown-menu-calendar ' + this.state.close}
          right
          id="iconMenuDropdown"
        >
          <ModalHeader>
            <p className="mb-1">{text}</p>
          </ModalHeader>
          <DatePicker
            className="react-datepicker"
            inline
            id={this.props.id}
            selected={this.state.fecha}
            onChange={this.handleChange}
            peekNextMonth={true}
            dropdownMode="select"
            dateFormat="DD/MM/YYYY"
            defaultValue={null}
          />
          <ModalFooter>
            <Button color="primary" onClick={this.onConfirm}>
              Confirmar
            </Button>
            <Button color="primary" onClick={this.handleClick}>
              Cancelar
            </Button>
          </ModalFooter>
        </DropdownMenu>
      </div>
    );
  }
}
export default injectIntl(Calendario);
