import React, { Fragment } from 'react';
import {
  Row,
  Input,
  Label,
  FormGroup,
  InputGroup,
  CustomInput,
} from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

class AdjuntarDesarrollo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      consigna: '',
      respuesta: {
        desarrollo: null,
        file: null,
      },
      isOpenImagePreview: false,
    };
  }

  componentDidMount() {
    if (this.props.value) {
      this.setState({
        consigna: this.props.value.consigna,
      });
    }
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    if (!name || name.length === 0) return;
    this.setState({ [name]: value });
    this.props.onEjercicioChange({ [name]: value }, this.props.ejercicioId);
  };

  removeRespuesta = () => {
    this.setState({
      respuesta: {
        desarrollo: null,
        file: null,
      },
    });
    this.props.onEjercicioChange({ respuesta: null }, this.props.value.numero);
  };

  handleImageChange = (event) => {
    event.preventDefault();
    const { files } = event.target;
    let reader = new FileReader();
    let file = files[0];
    let img = {
      file: file,
      desarrollo: '',
    };
    reader.onloadend = () => {
      img.desarrollo = reader.result;
      this.setState({
        respuesta: img,
      });
    };

    reader.readAsDataURL(file);
    this.props.onEjercicioChange(
      { respuesta: img.file },
      this.props.value.numero
    );
  };

  render() {
    let { consigna, respuesta, isOpenImagePreview } = this.state;

    const { preview, resolve } = this.props;

    return (
      <Fragment>
        {preview && (
          <div>
            <div className="mb-2">
              <Label>{consigna}</Label>
            </div>
            <div>
              <InputGroup className="mb-3">
                <CustomInput
                  type="file"
                  label="Adjuntá el desarrollo del ejercicio"
                  id="exampleCustomFileBrowser1"
                />
              </InputGroup>
            </div>
          </div>
        )}

        {resolve && (
          <div>
            <div className="mb-2">
              <Label>{consigna}</Label>
            </div>
            <div>
              {respuesta.desarrollo && (
                <Fragment>
                  <Row>
                    <Colxx className="flex">
                      <img
                        className="image-preview"
                        alt="img"
                        src={respuesta.desarrollo}
                      />
                      <div
                        className="mr-1 ml-1 glyph-icon simple-icon-magnifier-add zoom-icon"
                        onClick={() =>
                          this.setState({
                            isOpenImagePreview: true,
                          })
                        }
                      />
                      <div
                        className="glyph-icon simple-icon-close remove-icon ml-1 mr-1"
                        onClick={() => this.removeRespuesta()}
                      />
                    </Colxx>
                  </Row>
                </Fragment>
              )}
              {!respuesta.desarrollo && (
                <InputGroup className="mb-3">
                  <CustomInput
                    type="file"
                    label="Adjuntá el desarrollo del ejercicio"
                    id="exampleCustomFileBrowser1"
                    name="desarrollo"
                    onInputCapture={(e) => this.handleImageChange(e)}
                  />
                </InputGroup>
              )}
              {this.props.submitted && !respuesta.file ? (
                <div className="invalid-feedback d-block">
                  Adjuntar el desarrollo
                </div>
              ) : null}
            </div>
          </div>
        )}

        {!preview && !resolve && (
          <div className="rta-libre-container">
            <FormGroup className="error-l-75">
              <Label>Consigna</Label>
              <Input
                autoComplete="off"
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
        )}

        {isOpenImagePreview && (
          <Lightbox
            mainSrc={respuesta.desarrollo}
            onCloseRequest={() => this.setState({ isOpenImagePreview: false })}
          />
        )}
      </Fragment>
    );
  }
}

export default AdjuntarDesarrollo;
