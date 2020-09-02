import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Row, Card, CardTitle, CardBody } from 'reactstrap';
import ReactStickies from 'react-stickies';
import IntlMessages from 'helpers/IntlMessages';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import {
  getEventos,
  getEventosDelDia,
  guardarNotas,
  getDocument,
} from 'helpers/Firebase-db';
import moment from 'moment';
import 'moment/locale/es.js';
import DataListEventos from 'containers/pages/DataListEventos';
import { nota } from 'constants/notas';

const minTime = new Date();
minTime.setHours(8, 0, 0);
const maxTime = new Date();
maxTime.setHours(18, 0, 0);

const localizer = momentLocalizer(moment);

class Inicio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      notas: [],
      eventos: [],
      eventosDia: [],
    };
  }

  componentDidMount() {
    this.getEventos();
    this.setNotas();
  }

  componentWillUnmount() {
    const arrayTextos = this.state.notas.map((note) => {
      return note.text;
    });
    guardarNotas(this.props.user, arrayTextos);
  }

  setNotas = async () => {
    const arrayDeNotas = [];
    const { data } = await getDocument(`notas/${this.props.user}`);
    if (data) {
      data.notas.forEach((note) => {
        arrayDeNotas.push({
          ...nota,
          text: note,
        });
      });
    } else {
      arrayDeNotas.push({
        ...nota,
      });
    }
    this.setState({
      notas: arrayDeNotas,
    });
  };

  getEventos = async () => {
    const eventos = await getEventos(this.props.subject.id);
    const eventosDia = await getEventosDelDia(this.props.subject.id);
    this.setState({
      isLoading: false,
      eventos,
      eventosDia,
    });
  };

  onChangeNota = (notas) => {
    this.setState({
      notas,
    });
  };

  render() {
    const { isLoading, eventos, eventosDia } = this.state;
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
        <Row>
          <Colxx>
            <Card>
              <CardTitle className="card-title-evento">
                <i className="margin-right-icon simple-icon-event" />
                Eventos del día
              </CardTitle>
              <CardBody className="card-body-evento">
                {eventosDia.map((evento) => {
                  return (
                    <DataListEventos
                      key={evento.id + 'dataList'}
                      id={evento.id}
                      title={evento.title}
                      navTo={`/app/${evento.tipo}`}
                    />
                  );
                })}{' '}
              </CardBody>
            </Card>
            <ReactStickies
              notes={this.state.notas}
              onChange={this.onChangeNota}
              footer={false}
            />
          </Colxx>
          <Colxx>
            <Row className="row-home">
              <Card className="card-home">
                <Calendar
                  culture="es-ES"
                  localizer={localizer}
                  events={eventos}
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
              </Card>
            </Row>
          </Colxx>
        </Row>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ authUser, seleccionCurso }) => {
  const { user } = authUser;
  const { subject } = seleccionCurso;

  return {
    user,
    subject,
  };
};

export default connect(mapStateToProps)(Inicio);
