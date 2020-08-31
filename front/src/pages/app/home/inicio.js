import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Row } from 'reactstrap';
import ReactStickies from 'react-stickies';
import IntlMessages from 'helpers/IntlMessages';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es.js';
const myEventsList = [
  {
    title: 'Evento',
    start: '09/10/2020',
    end: '09/10/2020',
  },
];
const minTime = new Date();
minTime.setHours(8, 0, 0);
const maxTime = new Date();
maxTime.setHours(18, 0, 0);

const localizer = momentLocalizer(moment);

class Inicio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      notas: [],
    };
  }

  onChangeNota = (notas) => {
    this.setState({
      notas,
    });
  };

  render() {
    const { isLoading } = this.state;
    return isLoading ? (
      <div className="cover-spin" />
    ) : (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <h1>
              <IntlMessages id="menu.start" />
            </h1>
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        <Row className="row-home">
          <ReactStickies
            notes={this.state.notas}
            onChange={this.onChangeNota}
            footer={false}
          />
          <Calendar
            culture="es-ES"
            localizer={localizer}
            events={myEventsList}
            min={minTime}
            max={maxTime}
            startAccessor="start"
            endAccessor="end"
            className="calendar-home"
            messages={{
              next: '>',
              previous: '<',
              today: 'Hoy',
              month: 'Mes',
              week: 'Semana',
              day: 'Día',
            }}
          />
        </Row>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  const { user } = authUser;

  return {
    user,
  };
};

export default connect(mapStateToProps)(Inicio);
