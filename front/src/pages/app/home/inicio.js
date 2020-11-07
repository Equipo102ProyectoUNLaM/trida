import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Row, Card, CardTitle, CardBody, Input } from 'reactstrap';
import IntlMessages from 'helpers/IntlMessages';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import { SliderTooltip } from 'components/common/Slider';
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
import { horasAgenda } from 'helpers/Utils';
import ROLES from 'constants/roles';

const localizer = momentLocalizer(moment);
const horas = horasAgenda();

class Inicio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      notas: '',
      eventos: [],
      eventosDia: [],
      valorSlider: 3,
      themeColorArray: ['#8acaf5e3', '#f6c797', '#d7e6f0', '#d7f0e1'],
    };
  }

  componentDidMount() {
    this.getEventos();
    this.setNotas();
  }

  componentWillUnmount() {
    guardarNotas(this.props.user, this.state.notas);
  }

  setNotas = async () => {
    let notas = '';
    const { data } = await getDocument(`notas/${this.props.user}`);
    if (data) {
      notas = data.notas;
    }
    this.setState({
      notas,
    });
  };

  getEventos = async () => {
    const eventos = await getEventos(this.props.subject.id, this.props.user);
    const eventosDia = await getEventosDelDia(
      this.props.subject.id,
      this.props.user
    );
    this.setState({
      isLoading: false,
      eventos,
      eventosDia,
    });
  };

  onChangeNota = (event) => {
    this.setState({
      notas: event.target.value,
    });
  };

  onChangeSlider = (value) => {
    this.setState({
      valorSlider: value,
    });
  };

  render() {
    const { isLoading, eventos, eventosDia, notas, valorSlider } = this.state;
    const { rol } = this.props;
    const valorCritico = valorSlider === 1 || valorSlider === 2;
    const rolAlumno = rol === ROLES.Alumno;

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
          <Colxx className="mb-3" lg="5">
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
                      navTo={
                        evento.tipo === 'clase'
                          ? `/app/${evento.url}`
                          : `/app/${evento.url}#${evento.id}`
                      }
                    />
                  );
                })}{' '}
              </CardBody>
            </Card>
            <Card className="card-notas">
              <CardTitle className="card-title-evento">
                <i className="margin-right-icon iconsminds-notepad" />
                Mis Notas
              </CardTitle>
              <CardBody className="card-body-notas">
                <Input
                  placeholder={
                    !notas ? 'Podés dejar tus anotaciones acá' : null
                  }
                  className="notas"
                  onChange={this.onChangeNota}
                  type="textarea"
                  spellCheck="true"
                  rows="3"
                  defaultValue={notas}
                />
              </CardBody>
            </Card>
            {rolAlumno && (
              <Card className="card-slider">
                <CardBody>
                  <Colxx>
                    <label>
                      <IntlMessages id="ayuda.slider-alumno" />
                    </label>
                    <SliderTooltip
                      min={1}
                      max={5}
                      defaultValue={3}
                      className="mb-5"
                      onChange={this.onChangeSlider}
                    />
                    {valorCritico && (
                      <span className="mensaje-slider">
                        Si querés, podés enviarle un{' '}
                        <a
                          href="/app/comunicaciones/mensajeria"
                          className="btn-link"
                        >
                          mensaje{' '}
                        </a>
                        a tu docente.
                      </span>
                    )}
                  </Colxx>
                </CardBody>
              </Card>
            )}
          </Colxx>
          <Colxx lg="7">
            <Card>
              <CardBody>
                <Calendar
                  culture="es-ES"
                  localizer={localizer}
                  events={eventos}
                  min={horas.minTime}
                  style={{ minHeight: '35rem' }}
                  max={horas.maxTime}
                  startAccessor="start"
                  endAccessor="end"
                  className="calendar-home"
                  eventPropGetter={(event) => {
                    let newStyle = {
                      backgroundColor: 'white',
                      color: 'black',
                      border: 'none',
                    };

                    if (event.tipo === 'practica') {
                      newStyle.backgroundColor = this.state.themeColorArray[0];
                    }
                    if (event.tipo === 'evaluacion') {
                      newStyle.backgroundColor = this.state.themeColorArray[1];
                    }
                    if (event.tipo === 'clase') {
                      newStyle.backgroundColor = this.state.themeColorArray[2];
                    }
                    if (event.tipo === 'evaluacionOral') {
                      newStyle.backgroundColor = this.state.themeColorArray[3];
                    }

                    return {
                      className: '',
                      style: newStyle,
                    };
                  }}
                  messages={{
                    next: '>',
                    previous: '<',
                    today: 'Hoy',
                    month: 'Mes',
                    week: 'Semana',
                    day: 'Día',
                  }}
                />
              </CardBody>
            </Card>
          </Colxx>
        </Row>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ authUser, seleccionCurso }) => {
  const { user, userData } = authUser;
  const { rol } = userData;
  const { subject } = seleccionCurso;

  return {
    user,
    subject,
    rol,
  };
};

export default withRouter(connect(mapStateToProps)(Inicio));
