import React, { useEffect, useRef, useState } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { storage } from 'helpers/Firebase';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import { injectIntl } from 'react-intl';
import WebViewer from '@pdftron/webviewer';
import { Button, Row } from 'reactstrap';
import { editDocument } from 'helpers/Firebase-db';
import { enviarNotificacionExitosa } from 'helpers/Utils-ui';
const publicUrl = process.env.PUBLIC_URL;

const CorreccionTexto = ({ location }, rol) => {
  const history = useHistory();
  const { url, subjectId, idStorage, verCorreccion, id } = location;
  const [verCorr, setVerCorreccion] = useState(verCorreccion);
  const viewer = useRef(null);

  useEffect(() => {
    WebViewer(
      {
        fullAPI: true,
        path: `${publicUrl}/webviewer/lib`,
      },
      viewer.current
    ).then((instance) => {
      instance.setLanguage('es');
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
            const listRef = storage.ref(
              `materias/${subjectId}/correcciones/${idStorage}-correccion`
            );
            await listRef.put(blob);
            await editDocument('correcciones', id, {
              estado: 'Corregido',
            });
            enviarNotificacionExitosa(
              'La corrección fue subida exitosamente',
              'Corrección subida!'
            );
            history.push('/app/correcciones');
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
      <div className="webviewer" ref={viewer}></div>
      {!verCorr && (
        <Row className="button-group">
          <Button color="primary" className="button" id="guardar">
            Guardar
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
