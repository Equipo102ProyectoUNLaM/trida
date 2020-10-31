import React, { useEffect, Fragment, useState, useMemo } from 'react';
import { useJitsi } from 'react-jutsu'; // Custom hook
import {
  Button,
  Row,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  Alert,
} from 'reactstrap';
import moment from 'moment';
import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import {
  getTimestampDifference,
  getFechaHoraActual,
  isEmpty,
} from 'helpers/Utils';
import { injectIntl } from 'react-intl';
import ROLES from 'constants/roles';
import INTERFACE_CONFIG from 'constants/videollamada';
import {
  getCollectionOnSnapshot,
  getDocumentOnSnapshot,
  editDocument,
  getDocument,
  addDocument,
} from 'helpers/Firebase-db';
import { timeStamp } from 'helpers/Firebase';
import DataListView from 'containers/pages/DataListView';
import ModalGrande from 'containers/pages/ModalGrande';
import { desencriptarEjercicios } from 'handlers/DecryptionHandler';
import ContestarPregunta from './contestar-pregunta';
import classnames from 'classnames';
import Select from 'react-select';
import { MINUTOS_OPTIONS, SEGUNDOS_OPTIONS } from 'constants/tiempoPreguntas';

var preguntaLanzadaGlobal = []; // mientras no haga funcionar el setpreguntaLanzada, uso esta var global

const Videollamada = ({
  roomName,
  subject = 'Clase Virtual',
  userName,
  password,
  options,
  isHost,
  setCallOff,
  rol,
  idClase,
  preguntas,
  idUser,
}) => {
  const { microfono, camara, chat } = options;
  const parentNode = 'jitsi-container';
  const [shareButtonText, setShareScreenButtonText] = useState(
    'Compartir pantalla'
  );
  const [listaAsistencia, setListaAsistencia] = useState([]);

  const obtenerConfiguracion = (config) => {
    const newConfig = { ...config };

    if (!chat) {
      newConfig.TOOLBAR_BUTTONS = [...newConfig.TOOLBAR_BUTTONS, 'chat'];
    }

    return newConfig;
  };

  const opcionesDocente = useMemo(
    () => obtenerConfiguracion(INTERFACE_CONFIG.DOCENTE),
    [chat]
  );

  const opcionesAlumno = useMemo(
    () => obtenerConfiguracion(INTERFACE_CONFIG.ALUMNO),
    [chat]
  );

  const pizarronURI = '/pizarron';
  const [modalPreguntasOpen, setModalPreguntasOpen] = useState(false);
  const [modalPreviewOpen, setModalPreviewOpen] = useState(false);
  const [preguntaALanzar, setPreguntaALanzar] = useState(); // id de la pregunta a lanzar
  const [preguntasOnSnapshot, setPreguntasOnSnapshot] = useState([]);
  const [tiempoPreguntaOnSnapshot, setTiempoPreguntaOnSnapshot] = useState(); // Esta es la que escucha de firebase cuando se setea un tiempo a la pregunta
  const [alumnoRespondioPregunta, setAlumnoRespondioPregunta] = useState(true);
  const [modalPreguntasRealizadas, setModalPreguntasRealizadas] = useState(
    false
  );
  const [realizarPregunta, setRealizarPregunta] = useState(false);
  const [preguntasRealizadas, setPreguntasRealizadas] = useState([]);
  const [preguntaDeAlumno, setPreguntaDeAlumno] = useState('');
  const [reacciones, setReacciones] = useState({});
  const [hayPreguntas, setHayPreguntas] = useState(false);
  const [minutosSeleccionados, setMinutosSeleccionados] = useState();
  const [segundosSeleccionados, setSegundosSeleccionados] = useState();

  const setElementHeight = () => {
    const element = document.querySelector(`#${parentNode}`);
    if (element) {
      element.style.height = '85vh';
    }
  };

  const toggleShareScreen = () => {
    if (jitsi) {
      jitsi.executeCommand('toggleShareScreen');
    }
  };

  const abrirPizarron = () => {
    const strWindowFeatures = 'location=yes, scrollbars=yes, status=yes';
    window.open(pizarronURI, '_blank', strWindowFeatures);
  };

  const toggleModalPreguntas = () => {
    setModalPreguntasOpen(!modalPreguntasOpen);
  };

  const onSelectPregunta = (idPregunta) => {
    setPreguntaALanzar(idPregunta);
  };

  // Metodo para lanzar pregunta cuando estás con rol de profesor
  const onLanzarPregunta = async () => {
    const tiempoPregunta =
      minutosSeleccionados.value + ':' + segundosSeleccionados.value;
    editDocument(`clases/${idClase}/preguntas`, preguntaALanzar, {
      lanzada: true,
      seLanzo: true,
      tiempoDuracion: tiempoPregunta,
    });
    setPreguntaALanzar(null);
    toggleModalPreguntas();

    // Comienzo timer interno para cancelar la pregunta
    const mins = minutosSeleccionados.value
      ? Number(minutosSeleccionados.value) * 60
      : 0;
    const segs = segundosSeleccionados.value
      ? Number(segundosSeleccionados.value)
      : 0;
    const remainingTime = mins + segs; // queda en segundos
    if (remainingTime > 0) {
      setTimeout(() => {
        onCancelarPregunta(preguntaALanzar);
      }, remainingTime * 1000);
    }
  };

  const checkRespuestaAlumno = (document) => {
    setAlumnoRespondioPregunta(document.exists);
  };

  const onPreguntaRealizada = (doc) => {
    const arrayPreguntas = [];
    doc.forEach((document) => {
      const {
        alumno,
        fecha,
        pregunta,
        reacciones,
        creador,
        timeStamp,
      } = document.data();
      arrayPreguntas.push({
        id: document.id,
        alumno,
        fecha,
        pregunta,
        reacciones,
        creador,
        timeStamp,
      });
    });
    if (!isEmpty(arrayPreguntas)) {
      const arrayOrdenado = arrayPreguntas.sort(
        (elemA, elemB) => elemA.timeStamp.valueOf() - elemB.timeStamp.valueOf()
      );
      setPreguntasRealizadas(arrayOrdenado);
      setHayPreguntas(true);
    }
  };

  // Obtengo la pregunta que lanzó el profe y la muestro en el modal Preview al alumno
  const getPreguntaLanzada = (documents) => {
    preguntasOnSnapshot.length = 0; // Reinicio el array de las preguntas que escucho en RT de firestore
    documents.forEach((doc) => {
      //Appendeo las preguntas que cambiaron en preguntasOnSnapshot
      setPreguntasOnSnapshot(
        preguntasOnSnapshot.push({
          id: doc.id,
          data: doc.data(),
        })
      );
    });

    const preguntaLanzadaEncriptada = [];
    const preguntaLanzada = preguntasOnSnapshot.find(
      (pregunta) => pregunta.data.lanzada
    );

    //Me quedo con la pregunta lanzada, si la hay (lanzada == true)
    if (preguntaLanzada) {
      preguntaLanzadaEncriptada.push(preguntaLanzada);
      setTiempoPreguntaOnSnapshot(preguntaLanzada.data.tiempoDuracion);
    }

    //Desencripto la pregunta lanzada (si la hay)
    if (preguntaLanzadaEncriptada.length > 0) {
      preguntaLanzadaGlobal = [];
      const sinRespuesta = true;
      preguntaLanzadaGlobal = desencriptarEjercicios(
        preguntaLanzadaEncriptada,
        sinRespuesta
      );
      // Verifico si el alumno respondio la pregunta lanzada por el profe
      getDocumentOnSnapshot(
        `clases/${idClase}/preguntas/${preguntaLanzadaGlobal[0].id}/respuestas`,
        idUser,
        checkRespuestaAlumno
      );
      toggleModalPreviewPreguntaAlumno();
    }
  };

  useEffect(() => {
    getCollectionOnSnapshot(`clases/${idClase}/preguntas`, getPreguntaLanzada);
    getCollectionOnSnapshot(
      `preguntasDeAlumno/${idClase}/preguntas`,
      onPreguntaRealizada
    );
  }, [idClase]);

  const closeModalPreguntas = () => {
    setPreguntaALanzar(null);
    toggleModalPreguntas();
  };

  //Metodo que se ejecuta cuando el alumno responde una pregunta
  const respuestaDeAlumno = () => {
    // Cuando termina el timer en el modal ContestarPregunta, seteo lanzada=false
    onCancelarPregunta();

    // Limpio la pregunta lanzada
    preguntaLanzadaGlobal = [];
    //Cierro modal
    toggleModalPreviewPreguntaAlumno();
  };

  const onCancelarPregunta = async (preguntaALanzar = null) => {
    const idPregunta = preguntaALanzar
      ? preguntaALanzar
      : preguntaLanzadaGlobal[0].id;

    await editDocument(`clases/${idClase}/preguntas`, idPregunta, {
      lanzada: false,
    });

    preguntaLanzadaGlobal = [];
  };

  //Este metodo se ejecuta cuando se clickea en Cerrar en la modal de Preview de la pregunta
  const toggleModalPreviewPreguntaAlumno = () => {
    setModalPreviewOpen(!modalPreviewOpen);
  };

  const lanzamientoPreguntaValido = () => {
    return (
      preguntaALanzar && esTiempoValido() && preguntaLanzadaGlobal.length == 0
    );
  };

  const guardarListaAsistencia = async () => {
    const arrayMergeado = mergeArrayObjects(listaAsistencia, listaAsistencia);
    const arrayFiltrado = arrayMergeado.filter(
      (elem) => elem.timeStampConexion && elem.timeStampDesconexion
    );
    const asistencia = arrayFiltrado.map((elem) => ({
      ...elem,
      user: idUser,
      nombre: elem.nombre ? elem.nombre : 'Nombre',
      tiempoNeto: getTimestampDifference(
        elem.timeStampDesconexion,
        elem.timeStampConexion
      ),
    }));
    await editDocument('clases', idClase, { asistencia });
  };

  const mergeArrayObjects = (a1, a2) => {
    return a1.map((itm) => ({
      ...a2.find((item) => item.id === itm.id && item),
      ...itm,
    }));
  };

  const toggleRealizarPregunta = () => {
    setRealizarPregunta(!realizarPregunta);
  };

  const toggleModalPreguntasRealizadas = () => {
    setHayPreguntas(false);
    setModalPreguntasRealizadas(!modalPreguntasRealizadas);
  };

  const onRealizarPregunta = async () => {
    await addDocument(
      `preguntasDeAlumno/${idClase}/preguntas`,
      {
        pregunta: preguntaDeAlumno,
        alumno: userName,
        fecha: getFechaHoraActual(),
        reacciones: 0,
        timeStamp: timeStamp.fromDate(new Date()),
      },
      idUser,
      'Pregunta enviada!',
      'Pregunta enviada exitosamente'
    );
    toggleRealizarPregunta();
  };

  const updateReacciones = async (pregunta) => {
    const { id, creador } = pregunta;

    if (creador !== idUser && rol === ROLES.Alumno) {
      const { data } = await getDocument(
        `preguntasDeAlumno/${idClase}/preguntas/${id}`
      );

      const newReacciones = reacciones[id]
        ? data.reacciones - 1
        : data.reacciones + 1;

      editDocument(`preguntasDeAlumno/${idClase}/preguntas`, id, {
        reacciones: newReacciones,
      });

      setReacciones({
        ...reacciones,
        [id]: !reacciones[id],
      });
    }
  };

  const handleCancelarRealizarPregunta = () => {
    setPreguntaDeAlumno('');
    toggleRealizarPregunta();
  };

  const handleMinutoChange = (minSeleccionado) => {
    setMinutosSeleccionados(minSeleccionado);
  };

  const handleSegundosChange = (segSeleccionado) => {
    setSegundosSeleccionados(segSeleccionado);
  };

  const esTiempoValido = () => {
    if (
      !minutosSeleccionados ||
      !segundosSeleccionados ||
      (minutosSeleccionados.value === '00' &&
        segundosSeleccionados.value === '00')
    )
      return false;
    return true;
  };

  useEffect(() => {
    setElementHeight();

    window.addEventListener('resize', setElementHeight);

    return () => {
      window.removeEventListener('resize', setElementHeight);
    };
  }, []);

  const jitsi = useJitsi({
    roomName,
    parentNode,
    interfaceConfigOverwrite:
      rol !== ROLES.Alumno ? opcionesDocente : opcionesAlumno,
    configOverwrite: {
      disableDeepLinking: true,
      startWithAudioMuted: microfono,
      startWithVideoMuted: camara,
      defaultLanguage: 'es',
      disableRemoteMute: true,
      disableRemoteControl: true,
      remoteVideoMenu: { disableKick: { isHost } },
      prejoinPageEnabled: false,
    },
  });

  useEffect(() => {
    if (jitsi) {
      jitsi.executeCommand('displayName', userName);
      jitsi.addEventListener('videoConferenceJoined', () => {
        jitsi.executeCommand('displayName', userName);
        jitsi.executeCommand('subject', subject);
        //jitsi.executeCommand('password', password);
      });
      jitsi.addEventListener('videoConferenceLeft', () => {
        if (rol !== ROLES.Alumno) guardarListaAsistencia();
        setCallOff();
      });
      if (rol !== ROLES.Alumno) {
        jitsi.addEventListener('screenSharingStatusChanged', ({ on }) => {
          on
            ? setShareScreenButtonText('Dejar de Compartir pantalla')
            : setShareScreenButtonText('Compartir pantalla');
        });
        jitsi.addEventListener('participantJoined', ({ id, displayName }) => {
          setListaAsistencia(
            listaAsistencia.push({
              id,
              nombre: displayName,
              user: idUser,
              timeStampConexion: moment().format(),
            })
          );
        });
        jitsi.addEventListener('participantLeft', ({ id }) => {
          setListaAsistencia(
            listaAsistencia.push({
              id,
              timeStampDesconexion: moment().format(),
            })
          );
        });
      }
    }
    return () => {
      jitsi && jitsi.dispose();
    };
  }, [jitsi, userName, password, subject]);
  return (
    <Fragment>
      <Row className="button-group mb-3 mr-3">
        <Button
          className="button relative"
          color="primary"
          size="lg"
          onClick={toggleModalPreguntasRealizadas}
        >
          {hayPreguntas && <span className="notificacion-pregunta">.</span>}

          <IntlMessages id="clase.ver-preguntas-realizadas" />
        </Button>
        {rol !== ROLES.Alumno && (
          <>
            <Button
              className="button"
              color="primary"
              size="lg"
              onClick={toggleModalPreguntas}
            >
              <IntlMessages id="clase.lanzar-pregunta" />
            </Button>
            <Button
              className="button"
              color="primary"
              size="lg"
              onClick={toggleShareScreen}
            >
              {shareButtonText}
            </Button>{' '}
            <Button
              className="button"
              color="primary"
              size="lg"
              onClick={abrirPizarron}
            >
              <IntlMessages id="pizarron.abrir-pizarron" />
            </Button>
          </>
        )}
        {rol === ROLES.Alumno && (
          <Button
            className="button"
            color="primary"
            size="lg"
            onClick={toggleRealizarPregunta}
          >
            <IntlMessages id="clase.realizar-pregunta" />
          </Button>
        )}
      </Row>
      {realizarPregunta && (
        <ModalGrande
          modalOpen={realizarPregunta}
          toggleModal={toggleRealizarPregunta}
          text="Realizá una pregunta a tu docente"
        >
          <Row className="tip-text ml-0">
            {' '}
            <i className="iconsminds-arrow-right-in-circle mr-1" />{' '}
            <IntlMessages id="clase.realizar-pregunta-tip-recorda" />
          </Row>
          <Row className="tip-text ml-0">
            {' '}
            <i className="iconsminds-arrow-right-in-circle mr-1" />{' '}
            <IntlMessages id="clase.realizar-pregunta-tip-reaccion" />
          </Row>
          <FormGroup className="form-group has-float-label">
            <Label>
              <IntlMessages id="clase.escribir-pregunta" />
            </Label>
            <Input
              onChange={(e) => setPreguntaDeAlumno(e.target.value)}
              className="form-control mt-3"
              name="nombre"
            />
          </FormGroup>
          <ModalFooter>
            <Button color="primary" onClick={onRealizarPregunta}>
              Realizar Pregunta
            </Button>
            <Button color="secondary" onClick={handleCancelarRealizarPregunta}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalGrande>
      )}
      {modalPreguntasOpen && (
        <ModalGrande
          modalOpen={modalPreguntasOpen}
          toggleModal={toggleModalPreguntas}
          text="Preguntas de la Clase"
        >
          <Label className="timer-pregunta-clase">
            Seleccioná durante cuanto tiempo lanzar la pregunta
          </Label>
          <Row className="mb-3 mr-3">
            <Colxx xxs="4" md="4">
              <Select
                className="timer-pregunta-clase"
                classNamePrefix="select"
                isClearable={true}
                name="minutos-timer"
                options={MINUTOS_OPTIONS}
                value={minutosSeleccionados}
                onChange={handleMinutoChange}
                isDisabled={false}
                placeholder="Minutos"
                isSearchable={true}
              />
            </Colxx>
            <Colxx xxs="4" md="4">
              <Select
                options={SEGUNDOS_OPTIONS}
                classNamePrefix="select"
                value={segundosSeleccionados}
                name="segundos-timer"
                placeholder="Segundos"
                onChange={handleSegundosChange}
                isSearchable={true}
                isClearable={true}
              />
            </Colxx>
          </Row>
          {preguntas.map((pregunta) => {
            const consignaPregunta = pregunta.data.consigna;
            const preguntaLanzadaAlmenosUnaVez = pregunta.data.seLanzo;
            return (
              <DataListView
                key={pregunta.id}
                id={pregunta.id}
                title={consignaPregunta}
                modalLanzarPreguntas={true}
                preguntaALanzar={preguntaALanzar}
                onSelectPregunta={onSelectPregunta}
                seLanzo={preguntaLanzadaAlmenosUnaVez}
              />
            );
          })}
          <ModalFooter>
            {preguntaLanzadaGlobal.length > 0 && (
              <Alert color="warning" className="rounded alert-preguntas">
                Ups, tenés que esperar a que finalice el tiempo de la pregunta
                actual
              </Alert>
            )}
            <Button
              color="primary"
              disabled={!lanzamientoPreguntaValido()}
              onClick={onLanzarPregunta}
            >
              Lanzar Pregunta
            </Button>
            <Button color="secondary" onClick={closeModalPreguntas}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalGrande>
      )}
      {rol === ROLES.Alumno &&
        preguntaLanzadaGlobal.length > 0 &&
        !alumnoRespondioPregunta && (
          <ContestarPregunta
            toggle={toggleModalPreviewPreguntaAlumno}
            isOpen={modalPreviewOpen}
            preguntas={preguntaLanzadaGlobal}
            onRespuestaDeAlumno={respuestaDeAlumno}
            idClase={idClase}
            tiempoPreguntaOnSnapshot={tiempoPreguntaOnSnapshot}
          />
        )}
      {modalPreguntasRealizadas && (
        <Modal
          isOpen={modalPreguntasRealizadas}
          toggle={toggleModalPreguntasRealizadas}
          wrapClassName="modal-right"
          className="modal-ver-preguntas"
        >
          <ModalHeader toggle={toggleModalPreguntasRealizadas}>
            <IntlMessages id="clase.ver-preguntas-realizadas" />
          </ModalHeader>
          <ModalBody>
            {preguntasRealizadas.map((pregunta) => {
              return (
                <div className="notas mb-2 pt-2 pb-2" key={pregunta.id}>
                  <Row className="tip-text-cursiva ml-1 mt-2">
                    {pregunta.fecha}
                    {rol !== ROLES.Alumno ? ' - ' + pregunta.alumno : null}
                  </Row>
                  <Row className="ml-1 mt-2 mr-2">
                    <i className="iconsminds-speach-bubble-asking" />{' '}
                    <span className="font-weight-semibold mr-1">
                      {' '}
                      Pregunta:{' '}
                    </span>{' '}
                    {pregunta.pregunta}
                  </Row>
                  <Row
                    onClick={() => updateReacciones(pregunta)}
                    className={classnames({
                      'reaccion-pregunta': true,
                      active: reacciones[pregunta.id],
                      disabled: pregunta.creador === idUser,
                    })}
                  >
                    <span role="img" aria-label="mal">
                      👍
                    </span>
                    {pregunta.reacciones > 0 && (
                      <span className="texto-reaccion-pregunta">
                        + {pregunta.reacciones}
                      </span>
                    )}
                    {pregunta.reacciones === 0 && (
                      <span className="texto-reaccion-pregunta"> - </span>
                    )}
                  </Row>
                </div>
              );
            })}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={toggleModalPreguntasRealizadas}>
              Cerrar
            </Button>
          </ModalFooter>
        </Modal>
      )}
      <div id={parentNode}></div>
    </Fragment>
  );
};

export default injectIntl(Videollamada);
