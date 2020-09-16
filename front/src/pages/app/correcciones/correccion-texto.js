import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { storage } from 'helpers/Firebase';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import { injectIntl } from 'react-intl';
import WebViewer from '@pdftron/webviewer';
import { Button, Row } from 'reactstrap';
import ROLES from 'constants/roles';
const publicUrl = process.env.PUBLIC_URL;

const CorreccionTexto = ({ location }, rol) => {
  const { url, subjectId, idStorage } = location;
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

      document.getElementById('guardar').addEventListener('click', async () => {
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
      });
    });
  }, []);

  return (
    <div>
      <HeaderDeModulo heading="correcciones.corregir" />
      <div className="webviewer" ref={viewer}></div>
      <Row className="button-group">
        <Button color="primary" className="button" id="guardar">
          Guardar
        </Button>
        <Button className="button" id="cancelar">
          Cancelar
        </Button>
      </Row>
    </div>
  );
};

const mapStateToProps = ({ seleccionCurso, authUser }) => {
  const { subject } = seleccionCurso;
  const { userData } = authUser;
  const { rol } = userData;

  return { subject, rol };
};

export default injectIntl(connect(mapStateToProps)(CorreccionTexto));
