import React, { useEffect, Fragment, useState } from 'react';
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
} from 'reactstrap';
import IntlMessages from 'helpers/IntlMessages';
import { getTimestamp, getTimestampDifference } from 'helpers/Utils';
import { injectIntl } from 'react-intl';
import ROLES from 'constants/roles';
import INTERFACE_CONFIG from 'constants/videollamada';
import {
  editDocumentSinFechaEdicion,
  getCollectionOnSnapshot,
  editDocument,
  getDatosClaseOnSnapshot,
  getDocument,
} from 'helpers/Firebase-db';
import DataListView from 'containers/pages/DataListView';
import ModalGrande from 'containers/pages/ModalGrande';
import ModalVistaPreviaPreguntas from 'pages/app/clases-virtuales/clases/preguntas-clase/vista-previa-preguntas';
import { desencriptarEjercicios } from 'handlers/DecryptionHandler';

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
}) => {
  const { microfono, camara } = options;
  const parentNode = 'jitsi-container';
  const [shareButtonText, setShareScreenButtonText] = useState(
    'Compartir pantalla'
  );
  const [listaAsistencia, setListaAsistencia] = useState([]);
  const pizarronURI = '/pizarron';
  const [modalPreguntasOpen, setModalPreguntasOpen] = useState(false);
  const [modalPreviewOpen, setModalPreviewOpen] = useState(false);
  const [modalPreguntasRealizadas, setModalPreguntasRealizadas] = useState(
    false
  );
  const [preguntaALanzar, setPreguntaALanzar] = useState();
  const [realizarPregunta, setRealizarPregunta] = useState(false);
  const [preguntasRealizadas, setPreguntasRealizadas] = useState([]);
  const [preguntaDeAlumno, setPreguntaDeAlumno] = useState('');
  const [preguntasOnSnapshot, setPreguntasOnSnapshot] = useState([]);

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
  const onLanzarPregunta = () => {
    editDocument(`clases/${idClase}/preguntas`, preguntaALanzar, {
      lanzada: true,
      seLanzo: true,
    });
    setPreguntaALanzar(null);
    toggleModalPreguntas();
  };

  useEffect(() => {
    getCollectionOnSnapshot(`clases/${idClase}/preguntas`, getPreguntaLanzada);
    getDatosClaseOnSnapshot('preguntasDeAlumno', idClase, onPreguntaRealizada);
  }, []);

  const onPreguntaRealizada = (doc) => {
    const { preguntas } = doc.data();
    setPreguntasRealizadas(preguntas);
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
    }

    //Desencripto la pregunta lanzada (si la hay)
    if (preguntaLanzadaEncriptada.length > 0) {
      preguntaLanzadaGlobal = [];
      const sinRespuesta = true;
      preguntaLanzadaGlobal = desencriptarEjercicios(
        preguntaLanzadaEncriptada,
        sinRespuesta
      );
      toggleModalPreviewPreguntaAlumno();
    }
  };

  const closeModalPreguntas = () => {
    setPreguntaALanzar(null);
    toggleModalPreguntas();
  };

  //Metodo que se ejecuta cuando el alumno responde una pregunta
  const respuestaDeAlumno = () => {
    // NOTA: POR AHORA, PONGO EN FALSE EL LANZADA CUANDO EL ALUMNO CLICKEA EN "CERRAR", DESPUÉS AGREGO LA LÓGICA DE QUE SE HAGA CON TIMER
    editDocument(`clases/${idClase}/preguntas`, preguntaLanzadaGlobal[0].id, {
      lanzada: false,
    });

    // Limpio la pregunta lanzada
    preguntaLanzadaGlobal = [];
    //Cierro modal
    toggleModalPreviewPreguntaAlumno();
  };

  //Este metodo se ejecuta cuando se clickea en Cerrar en la modal de Preview de la pregunta
  const toggleModalPreviewPreguntaAlumno = () => {
    setModalPreviewOpen(!modalPreviewOpen);
  };

  const guardarListaAsistencia = async () => {
    const arrayMergeado = mergeArrayObjects(listaAsistencia, listaAsistencia);
    const arrayFiltrado = arrayMergeado.filter(
      (elem) => elem.timeStampConexion && elem.timeStampDesconexion
    );
    const asistencia = arrayFiltrado.map((elem) => ({
      ...elem,
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
    setModalPreguntasRealizadas(!modalPreguntasRealizadas);
  };

  const onRealizarPregunta = async () => {
    const { data } = await getDocument(`preguntasDeAlumno/${idClase}`);
    editDocumentSinFechaEdicion(
      'preguntasDeAlumno',
      idClase,
      {
        preguntas: [
          ...data.preguntas,
          { pregunta: preguntaDeAlumno, alumno: userName },
        ],
      },
      'Pregunta enviada'
    );
    toggleRealizarPregunta();
  };

  const handleCancelarRealizarPregunta = () => {
    setPreguntaDeAlumno('');
    toggleRealizarPregunta();
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
      rol === ROLES.Docente
        ? INTERFACE_CONFIG.DOCENTE
        : INTERFACE_CONFIG.ALUMNO,
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
      jitsi.addEventListener('readyToClose', () => {
        if (rol === ROLES.Docente) guardarListaAsistencia();
        setCallOff();
      });
      if (rol === ROLES.Docente) {
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
              timeStampConexion: getTimestamp(),
            })
          );
        });
        jitsi.addEventListener('participantLeft', ({ id }) => {
          setListaAsistencia(
            listaAsistencia.push({ id, timeStampDesconexion: getTimestamp() })
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
        {preguntasRealizadas && (
          <Button
            className="button"
            color="primary"
            size="lg"
            onClick={toggleModalPreguntasRealizadas}
          >
            <IntlMessages id="clase.ver-preguntas-realizadas" />
          </Button>
        )}
        {rol === ROLES.Docente && (
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
      </Row>

      {rol === ROLES.Alumno && (
        <Row className="button-group mb-3 mr-3">
          <Button
            className="button"
            color="primary"
            size="lg"
            onClick={toggleRealizarPregunta}
          >
            <IntlMessages id="clase.realizar-pregunta" />
          </Button>
        </Row>
      )}
      {realizarPregunta && (
        <ModalGrande
          modalOpen={realizarPregunta}
          toggleModal={toggleRealizarPregunta}
          text="Realizá una pregunta a tu docente"
        >
          <span className="tip-text">
            {' '}
            <IntlMessages id="clase.realizar-pregunta-tip" />
          </span>
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
            <Button
              color="primary"
              disabled={!preguntaALanzar}
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
      {/* CUANDO SE HAGA LOGICA DE LA RTA, SE AGREGA LA VALIDACIÓN DE QUE NO ESTÉ RESPONDIDA PARA MOSTRAR EL MODAL */}
      {rol === ROLES.Alumno && preguntaLanzadaGlobal.length > 0 && (
        <ModalVistaPreviaPreguntas
          toggle={toggleModalPreviewPreguntaAlumno}
          isOpen={modalPreviewOpen}
          preguntas={preguntaLanzadaGlobal}
          esRespuestaDeAlumno={true}
          onRespuestaDeAlumno={respuestaDeAlumno}
        />
      )}
      {modalPreguntasRealizadas && (
        <Modal
          isOpen={modalPreguntasRealizadas}
          toggle={toggleModalPreguntasRealizadas}
          wrapClassName="modal-right"
        >
          <ModalHeader toggle={toggleModalPreguntasRealizadas}>
            <IntlMessages id="clase.ver-preguntas-realizadas" />
          </ModalHeader>
          <ModalBody>
            {preguntasRealizadas.map((pregunta) => {
              return (
                <div key={pregunta.pregunta}>
                  <Row>{pregunta.pregunta}</Row>
                  <Row>{rol === ROLES.Docente ? pregunta.alumno : null}</Row>
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
