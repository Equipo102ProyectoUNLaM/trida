import React from 'react';
import { Separator } from 'components/common/CustomBootstrap';
import {
  Row,
  Button,
  CustomInput,
  FormGroup,
  Label,
  ModalBody,
} from 'reactstrap';
import { editDocument } from 'helpers/Firebase-db';
import { isEmpty } from 'helpers/Utils';

class ModalAsociarContenidos extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nombresContenidos: [],
      isLoading: false,
    };
  }

  componentDidMount() {
    if (this.props.contenidos) {
      const nombresContenidos = this.props.contenidos.map((contenido) => {
        const paths = contenido.split('/');
        return paths[paths.length - 1];
      });

      this.setState({
        nombresContenidos,
      });
    }
  }

  isFileSelected = (file) => {
    return this.state.nombresContenidos.some((archivo) => archivo === file);
  };

  handleFileChecked = (event) => {
    let selectedFiles = [...this.state.nombresContenidos];

    const estaSeleccionado = selectedFiles.some(
      (archivo) => archivo === event.target.name
    );

    if (estaSeleccionado) {
      selectedFiles = selectedFiles.filter(
        (archivo) => archivo !== event.target.name
      );
    } else {
      selectedFiles = [...selectedFiles, event.target.name];
    }

    this.setState({
      nombresContenidos: selectedFiles,
    });
  };

  editContenidos = async () => {
    const contenidos = this.state.nombresContenidos.map(
      (nombre) =>
        'gs://trida-7f28f.appspot.com/' +
        this.props.idMateria +
        '/contenidos/' +
        nombre
    );

    await editDocument('clases', this.props.idClase, { contenidos }, 'Clase');
    this.props.toggleModalContenidos();
    this.props.updateContenidos();
  };

  render() {
    const { toggleModalContenidos, isLoading, files } = this.props;
    return isLoading ? (
      <ModalBody>
        <div className="loading" />
      </ModalBody>
    ) : (
      <>
        {isEmpty(files) ? (
          <p className="mb-4">No hay contenidos en la materia</p>
        ) : (
          files.map((file) => {
            const isSelected = this.isFileSelected(file.key);

            return (
              <Row key={file.key}>
                <FormGroup>
                  <div>
                    <CustomInput
                      id={file.key}
                      type="checkbox"
                      name={file.key}
                      label={<Label>{file.key}</Label>}
                      checked={isSelected}
                      onChange={this.handleFileChecked}
                    />
                  </div>
                </FormGroup>
              </Row>
            );
          })
        )}
        <Separator className="mb-5" />
        <Row className="button-group">
          {!isEmpty(files) && (
            <Button
              onClick={this.editContenidos}
              className="button"
              color="primary"
              size="lg"
            >
              Asociar Contenidos
            </Button>
          )}
          <Button
            onClick={toggleModalContenidos}
            className="button"
            color="primary"
            size="lg"
          >
            Cancelar
          </Button>
        </Row>
      </>
    );
  }
}

export default ModalAsociarContenidos;
