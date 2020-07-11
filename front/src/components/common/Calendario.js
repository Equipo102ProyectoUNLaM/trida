import React from 'react';
import DatePicker from 'react-datepicker';
import { DropdownMenu, Button } from 'reactstrap';
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
    const { text } = this.props;

    return (
      <div
        className="glyph-icon simple-icon-calendar set-date-action-icon relative"
        onClick={this.handleClick}
      >
        <DropdownMenu
          className={'dropdown-menu-calendar ' + this.state.close}
          right
          id="iconMenuDropdown"
        >
          <p className="mb-1">{text}</p>
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
          <Button color="primary" onClick={this.onConfirm}>
            Confirmar
          </Button>
          <Button color="primary" onClick={this.handleClick}>
            Cancelar
          </Button>
        </DropdownMenu>
      </div>
    );
  }
}
export default injectIntl(Calendario);
