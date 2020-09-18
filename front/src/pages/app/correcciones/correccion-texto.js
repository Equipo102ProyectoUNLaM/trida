import React, { useEffect, useRef, useState } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { storage } from 'helpers/Firebase';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import { injectIntl } from 'react-intl';
import WebViewer from '@pdftron/webviewer';
import {
  Button,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Badge,
} from 'reactstrap';
import IntlMessages from 'helpers/IntlMessages';
import Select from 'react-select';
import { editDocument } from 'helpers/Firebase-db';
import { enviarNotificacionExitosa } from 'helpers/Utils-ui';
import ESTADO_CORRECCION from 'constants/estadoCorreccion';
import NOTA_CORRECCION from 'constants/notaCorreccion';
const publicUrl = process.env.PUBLIC_URL;

const CorreccionTexto = ({ location }, rol) => {
  const history = useHistory();
  const {
    url,
    subjectId,
    idStorage,
    verCorreccion,
    id,
    estadoCorreccionVer,
    notaCorreccionVer,
    comentarioVer,
  } = location;
  const [verCorr, setVerCorreccion] = useState(verCorreccion);
  const [modalConfirmacion, setModalConfirmacion] = useState(false);
  const [estadoCorreccion, setEstado] = useState('');
  const [notaCorreccion, setNotaCorreccion] = useState('');
  const [comentario, setComentario] = useState('-');
  const [showNotas, setShowNotas] = useState(false);
  const [blob, setBlob] = useState([]);
  const viewer = useRef(null);

  const toggleModalConfirmacion = () => {
    setModalConfirmacion(!modalConfirmacion);
  };

  const handleEstadoChange = (selectedOption) => {
    if (selectedOption) {
      setEstado(selectedOption);
      setShowNotas(true);
    } else {
      setEstado('');
      setShowNotas(false);
    }
  };

  const handleNotaChange = (selectedOption) => {
    if (selectedOption) {
      setNotaCorreccion(selectedOption);
    } else {
      setNotaCorreccion('');
    }
  };

  const handleChange = (event) => {
    const { value } = event.target;
    setComentario(value);
  };

  const handleCancelarConfirmacion = () => {
    toggleModalConfirmacion();
    setEstado('');
    setNotaCorreccion('');
    setComentario('');
  };

  const confirmarCorreccion = async () => {
    toggleModalConfirmacion();
    const listRef = storage.ref(
      `materias/${subjectId}/correcciones/${idStorage}-correccion`
    );
    await listRef.put(blob);
    await editDocument('correcciones', id, {
      estado: 'Corregido',
      estadoCorreccion: estadoCorreccion.value,
      notaCorreccion: notaCorreccion.value,
      comentarioCorreccion: comentario,
    });
    enviarNotificacionExitosa(
      'La corrección fue subida exitosamente',
      'Corrección subida!'
    );
    history.push('/app/correcciones');
  };

  useEffect(() => {
    WebViewer(
      {
        fullAPI: true,
        path: `${publicUrl}/webviewer/lib`,
      },
      viewer.current
    ).then((instance) => {
      instance.setLanguage('es');
      instance.disableElements([
        'toggleNotesButton',
        'menuButton',
        'stickyToolGroupButton',
      ]);
      if (verCorr) {
        instance.disableElements([
          'header',
          'viewControlsOverlay',
          'menuOverlay',
          'toolsOverlay',
          'toolsHeader',
        ]);
      }
      instance.loadDocument(url, { documentId: 'id2' });
      const { docViewer, Annotations } = instance;
      const annotManager = docViewer.getAnnotationManager();

      docViewer.on('documentLoaded', () => {
        const rectangleAnnot = new Annotations.RectangleAnnotation();
        rectangleAnnot.PageNumber = 1;
        rectangleAnnot.X = 100;
        rectangleAnnot.Y = 150;
        rectangleAnnot.Width = 200;
        rectangleAnnot.Height = 150;
        rectangleAnnot.Author = annotManager.getCurrentUser();

        //annotManager.addAnnotation(rectangleAnnot);
        // need to draw the annotation otherwise it won't show up until the page is refreshed
        //annotManager.redrawAnnotation(rectangleAnnot);
      });

      if (!verCorr) {
        document
          .getElementById('guardar')
          .addEventListener('click', async () => {
            const doc = docViewer.getDocument();
            const xfdfString = await annotManager.exportAnnotations();
            const options = { xfdfString, flatten: true };
            const data = await doc.getFileData(options);
            const arr = new Uint8Array(data);
            const blob = new Blob([arr], { type: 'application/pdf' });
            setBlob(blob);
            setModalConfirmacion(true);
          });
      }
    });
  }, []);

  return (
    <div>
      <HeaderDeModulo
        heading={verCorr ? 'correcciones.ver' : 'correcciones.corregir'}
        toggleModal={() => history.push('/app/correcciones')}
        buttonText="correcciones.volver"
      />
      {verCorr && (
        <>
          <Row className="status-correccion">
            <span className="font-weight-semibold">Estado </span>
            <Badge
              key={1 + 'badge'}
              color="primary"
              pill
              className="badge-correccion"
            >
              {estadoCorreccionVer.toUpperCase()}
            </Badge>
            <span className="font-weight-semibold">Nota </span>
            <Badge
              key={2 + 'badge'}
              color="primary"
              pill
              className="badge-correccion"
            >
              {notaCorreccionVer}
            </Badge>
          </Row>
          <Row className="status-correccion">
            <span className="font-weight-semibold">Comentario:</span>
            <span className="ml-1"> {comentarioVer}</span>
          </Row>
        </>
      )}
      <div className="webviewer" ref={viewer}></div>
      {!verCorr && (
        <Row className="button-group">
          <Button color="primary" className="button" id="guardar">
            Enviar Corrección
          </Button>
          <Button
            className="button"
            id="cancelar"
            onClick={() => history.push('/app/correcciones')}
          >
            Cancelar
          </Button>
        </Row>
      )}
      {modalConfirmacion && (
        <Modal isOpen={modalConfirmacion} toggle={toggleModalConfirmacion}>
          <ModalHeader toggle={toggleModalConfirmacion}>
            Enviar Corrección
          </ModalHeader>
          <ModalBody>
            <Row>
              <div className="form-group has-float-label without-tooltip">
                <Select
                  className="react-select"
                  classNamePrefix="select"
                  isClearable={true}
                  name="estadoCorreccion"
                  options={ESTADO_CORRECCION}
                  value={estadoCorreccion}
                  onChange={handleEstadoChange}
                  placeholder="Seleccionar estado..."
                />
                <IntlMessages id="correcciones.estado" />
              </div>
            </Row>
            {showNotas && (
              <Row>
                <div className="form-group has-float-label without-tooltip">
                  <Select
                    className="react-select"
                    classNamePrefix="select"
                    isClearable={true}
                    name="notaCorreccion"
                    options={NOTA_CORRECCION}
                    value={notaCorreccion}
                    onChange={handleNotaChange}
                    isDisabled={false}
                    placeholder="Seleccionar nota..."
                  />
                  <IntlMessages id="correcciones.calificacion" />
                </div>
              </Row>
            )}
            <div className="form-group has-float-label">
              <Input
                onChange={(event) => handleChange(event)}
                type="textarea"
              />
              <IntlMessages id="correcciones.comentario" />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              size="sm"
              onClick={confirmarCorreccion}
              disabled={estadoCorreccion ? false : true}
            >
              Confirmar
            </Button>
            <Button
              color="secondary"
              size="sm"
              onClick={handleCancelarConfirmacion}
            >
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
};

const mapStateToProps = ({ seleccionCurso, authUser }) => {
  const { subject } = seleccionCurso;
  const { userData } = authUser;
  const { rol } = userData;

  return { subject, rol };
};

export default withRouter(
  injectIntl(connect(mapStateToProps)(CorreccionTexto))
);
