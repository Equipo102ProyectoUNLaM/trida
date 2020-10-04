import React, { Fragment } from 'react';
import {
  Row,
  Input,
  Button,
  Label,
  FormGroup,
  InputGroup,
  CustomInput,
} from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

class OpcionMultipleImagen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      consigna: '',
      respuestas: [],
      opciones: [
        {
          opcion: '',
          verdadera: false,
        },
      ],
      isOpenImagePreview: false,
      openOption: '',
    };
  }

  componentDidMount() {
    if (this.props.value.opciones) {
      this.setState({
        consigna: this.props.value.consigna,
        opciones: this.props.value.opciones,
      });
    }
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    if (!name || name.length === 0) return;
    this.setState({ [name]: value });
    this.props.onEjercicioChange({ [name]: value }, this.props.ejercicioId);
  };

  handleOptionsChange = (event, index) => {
    event.preventDefault();
    const { value, name } = event.target;
    let list = this.state.opciones;

    let reader = new FileReader();
    let file = event.target.files[0];
    reader.onloadend = () => {
      list[index] = Object.assign(list[index], {
        [name]: value,
        file: file,
        opcion: reader.result,
      });
      this.setState({ opciones: list });
    };

    reader.readAsDataURL(file);
    this.props.onEjercicioChange({ opciones: list }, this.props.ejercicioId);
  };

  handleCheckBoxChange = (event, index) => {
    const { name, checked } = event.target;
    let list = this.state.opciones;
    list[index] = Object.assign(list[index], { [name]: checked });
    this.setState({ opciones: list });
    this.props.onEjercicioChange({ opciones: list }, this.props.ejercicioId);
  };

  handleResponseCheckBoxChange = (event, index) => {
    const { checked } = event.target;
    let rtas = this.state.respuestas;
    rtas.push({ indiceOpcion: index, respuesta: checked });
    this.setState({
      respuestas: rtas,
    });
    this.props.onEjercicioChange(
      { indiceOpcion: index, respuesta: checked },
      this.props.value.numero
    );
  };

  handleAddOpcion = (e) => {
    let newOpciones = this.state.opciones;
    let opcion = {
      opcion: '',
      verdadera: false,
    };
    newOpciones.push(opcion);
    this.setState({
      opciones: newOpciones,
    });
  };

  removeOption = (index) => {
    let newOpciones = this.state.opciones;
    newOpciones.splice(index, 1);
    this.setState({
      opciones: newOpciones,
    });
  };

  render() {
    let { opciones, consigna, respuestas, isOpenImagePreview } = this.state;

    const { preview, resolve } = this.props;

    return (
      <Fragment>
        {preview && (
          <div>
            <div className="mb-2">
              <Label>{consigna}</Label>
            </div>
            {opciones.map((op, index) => {
              return (
                <Row key={'row' + index} className="opcionMultipleRow">
                  <Colxx xxs="2" className="flex">
                    <Input
                      name="respuesta"
                      className="margin-auto checkbox"
                      type="checkbox"
                    />
                  </Colxx>
                  <Colxx xxs="10" className="flex">
                    <img
                      src={op.opcion}
                      alt="img"
                      className="image-preview"
                    ></img>
                    <Colxx xxs="1" className="icon-container">
                      <div
                        className="margin-auto"
                        style={{ textAlign: 'center' }}
                      >
                        <div
                          className="glyph-icon simple-icon-magnifier-add zoom-icon"
                          onClick={() =>
                            this.setState({
                              isOpenImagePreview: true,
                              openOption: index,
                            })
                          }
                        ></div>
                      </div>
                    </Colxx>
                  </Colxx>
                </Row>
              );
            })}{' '}
          </div>
        )}

        {resolve && (
          <div>
            <div className="mb-2">
              <Label>{consigna}</Label>
            </div>
            {opciones.map((op, index) => (
              <Row key={'row' + index} className="opcionMultipleRow">
                <Colxx xxs="2" className="flex">
                  <Input
                    name="verdadera"
                    className="margin-auto checkbox"
                    type="checkbox"
                    onChange={(e) =>
                      this.handleResponseCheckBoxChange(e, index)
                    }
                  />
                </Colxx>
                <Colxx xxs="10" className="flex">
                  <img className="image-preview" alt="img" src={op.opcion} />
                  <Colxx xxs="1" className="icon-container">
                    <div
                      className="margin-auto"
                      style={{ textAlign: 'center' }}
                    >
                      <div
                        className="glyph-icon simple-icon-magnifier-add zoom-icon"
                        onClick={() =>
                          this.setState({
                            isOpenImagePreview: true,
                            openOption: index,
                          })
                        }
                      ></div>
                    </div>
                  </Colxx>
                </Colxx>
              </Row>
            ))}{' '}
            {this.props.submitted &&
            !respuestas.find((x) => x.respuesta === true) ? (
              <div className="invalid-feedback d-block">
                Al menos una opción seleccionada es requerida
              </div>
            ) : null}
          </div>
        )}

        {!preview && !resolve && (
          <div>
            <div className="rta-libre-container">
              <FormGroup className="error-l-75">
                <Label>Pregunta</Label>
                <Input
                  autocomplete="off"
                  name="consigna"
                  onInputCapture={this.handleChange}
                  defaultValue={consigna}
                />
                {this.props.submitted && !consigna ? (
                  <div className="invalid-feedback d-block">
                    Ingresar una pregunta
                  </div>
                ) : null}
              </FormGroup>
            </div>
            <div className="rta-libre-container">
              <FormGroup className="error-l-275">
                <Label>Opciones (Marque con un tilde las correctas)</Label>
                {this.props.submitted &&
                (!opciones || opciones.length === 0) ? (
                  <div className="invalid-feedback d-block">
                    Opciones requeridas
                  </div>
                ) : null}
                {opciones.map((op, index) => (
                  <Row key={'row' + index} className="opcionMultipleRow">
                    <Input
                      name="verdadera"
                      className="margin-auto checkbox"
                      type="checkbox"
                      onChange={(e) => this.handleCheckBoxChange(e, index)}
                      checked={op.verdadera}
                    />
                    {op.opcion && (
                      <Fragment>
                        <img
                          className="image-preview"
                          alt="img"
                          src={op.opcion}
                        />
                        <Colxx xxs="1" className="icon-container">
                          <div
                            className="margin-auto"
                            style={{ textAlign: 'center' }}
                          >
                            <div
                              className="glyph-icon simple-icon-magnifier-add zoom-icon"
                              onClick={() =>
                                this.setState({
                                  isOpenImagePreview: true,
                                  openOption: index,
                                })
                              }
                            ></div>
                          </div>
                        </Colxx>
                      </Fragment>
                    )}
                    {!op.opcion && (
                      <InputGroup className="mb-3 opcionMultipleInput margin-auto">
                        <CustomInput
                          type="file"
                          label="Seleccione una imagen"
                          id="exampleCustomFileBrowser1"
                          name="opcion"
                          onInputCapture={(e) =>
                            this.handleOptionsChange(e, index)
                          }
                        />
                      </InputGroup>
                    )}

                    <div
                      className="glyph-icon simple-icon-close remove-icon"
                      onClick={() => this.removeOption(index)}
                    />
                    {this.props.submitted &&
                    !opciones.find((x) => x.verdadera === true) ? (
                      <div
                        className="invalid-feedback d-block"
                        style={{ left: '525px' }}
                      >
                        Una respuesta verdadera es requerida
                      </div>
                    ) : null}
                    {this.props.submitted && opciones.find((x) => !x.opcion) ? (
                      <div className="invalid-feedback d-block">
                        Todas las opciones son requeridas
                      </div>
                    ) : null}
                  </Row>
                ))}
              </FormGroup>
            </div>
            <Button
              outline
              onClick={this.handleAddOpcion}
              size="sm"
              color="primary"
              className="button margin-auto"
            >
              {' '}
              Agregar Opción{' '}
            </Button>
          </div>
        )}

        {isOpenImagePreview && (
          <Lightbox
            mainSrc={opciones[this.state.openOption].opcion}
            onCloseRequest={() => this.setState({ isOpenImagePreview: false })}
          />
        )}
      </Fragment>
    );
  }
}

export default OpcionMultipleImagen;
