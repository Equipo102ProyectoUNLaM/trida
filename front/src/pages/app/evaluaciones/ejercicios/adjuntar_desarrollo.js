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

class AdjuntarDesarrollo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      consigna: '',
      respuesta: '',
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

  handleImageChange = (event) => {
    event.preventDefault();
    const { value, name } = event.target;
    let reader = new FileReader();
    let file = event.target.files[0];
    let img = {
      [name]: value,
      file: file,
      desarrollo: reader.result,
    };
    reader.onloadend = () => {
      this.setState({
        respuesta: img,
      });
    };

    reader.readAsDataURL(file);
    this.props.onEjercicioChange({ respuesta: img }, this.props.ejercicioId);
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
              {respuesta && (
                <Fragment>
                  <img
                    className="image-preview"
                    alt="img"
                    src={respuesta.desarrollo}
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
                          })
                        }
                      ></div>
                    </div>
                  </Colxx>
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
            </div>
          </div>
        )}

        {!preview && !resolve && (
          <div className="rta-libre-container">
            <FormGroup className="error-l-75">
              <Label>Pregunta</Label>
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
