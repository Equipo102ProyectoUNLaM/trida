import React from 'react';
import { Separator } from 'components/common/CustomBootstrap';
import { Row, Button, CustomInput, FormGroup, Label } from 'reactstrap';
import { editDocument } from 'helpers/Firebase-db';

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
    if (this.state.nombresContenidos) {
      return this.state.nombresContenidos.some((archivo) => archivo === file);
    }
    return false;
  };

  handleFileChecked = (event) => {
    let selectedFiles = [];
    if (this.state.nombresContenidos) {
      selectedFiles = [...this.state.nombresContenidos];
    }

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
        'gs://trida-7f28f.appspot.com/' + this.props.idMateria + '/' + nombre
    );

    await editDocument(
      'clases',
      this.props.idClase,
      { contenidos },
      'Contenido'
    );
    this.props.toggleModalContenidos();
    this.props.updateContenidos();
  };

  render() {
    const { toggleModalContenidos, isLoading, files } = this.props;
    return isLoading ? (
      <Row className="mb-5">
        <div className="loading" />
      </Row>
    ) : (
      <>
        {files.map((file) => {
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
        })}
        <Separator className="mb-5" />
        <Row className="button-group">
          <Button
            onClick={this.editContenidos}
            className="button"
            color="primary"
            size="lg"
          >
            Asociar Contenidos
          </Button>
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
