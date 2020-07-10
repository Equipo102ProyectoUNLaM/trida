import React from "react";
import DatePicker from "react-datepicker";
import {UncontrolledDropdown, DropdownMenu, DropdownToggle, Button } from 'reactstrap';
import { injectIntl } from 'react-intl';

//import "react-datepicker/dist/react-datepicker.css";


class Calendario extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = ({
            fecha: null,
            close: 'show',
        });
    }

    handleChange = date => {
        this.setState({
          fecha: date
        }, ()=>console.log(this.state.fecha.format('DD/MM/YYYY')));
      };

    handleClick = () => {
        this.setState({
          close: ''
        }, ()=> console.log(this.state.close));
      };
    
    render() {
        const { text, handleClick } = this.props;

        return (
            <div>
                <UncontrolledDropdown className={"dropdown-menu-right" + this.state.close}>
                    <DropdownToggle color="empty">
                        <i className="glyph-icon simple-icon-calendar set-date-action-icon" />
                    </DropdownToggle>
                    <DropdownMenu
                        className="dropdown-menu-calendar"
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
                            shouldCloseOnSelect={true}
                            defaultValue={null}
                        />
                        <Button color="primary" onClick={this.handleClick}>Confirmar</Button>
                    </DropdownMenu>
                </UncontrolledDropdown>
            </div>
        );
    }

}
export default injectIntl(Calendario);
