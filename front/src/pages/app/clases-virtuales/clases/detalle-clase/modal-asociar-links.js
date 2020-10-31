import React from 'react';
import { Separator } from 'components/common/CustomBootstrap';
import { Row, Button, FormGroup, Label, ModalBody } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { editDocument } from 'helpers/Firebase-db';
import { isEmpty } from 'helpers/Utils';
import IntlMessages from 'helpers/IntlMessages';

class ModalAsociarLinks extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputLink: '',
      links: this.props.links,
      isLoading: false,
    };
  }

  agregarLink = (value) => {
    if (value.link) {
      if (this.state.links) {
        this.setState({
          links: [
            ...this.state.links,
            {
              link: value.link,
              descripcion: value.descripcion
                ? value.descripcion
                : 'Sin descripción',
            },
          ],
        });
      } else {
        this.setState({
          links: [{ link: value.link, descripcion: value.descripcion }],
        });
      }
    }
  };

  handleInputChange = (event) => {
    this.setState({
      inputLink: event.target.value,
    });
  };

  editLinks = async () => {
    await editDocument(
      'clases',
      this.props.idClase,
      { links: this.state.links },
      'Clase'
    );
    this.props.toggleModalLinks();
    this.props.updateLinks();
  };

  deleteLink = async (index) => {
    let links = [...this.state.links];
    links = links.filter((link) => link.link !== index);
    this.setState({
      links,
    });
  };

  validateLink = (value) => {
    let error;
    if (!value) {
      error = 'El link es requerido';
    } else if (
      !/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(
        value
      )
    ) {
      error = 'Formato de link inválido';
    }
    return error;
  };

  render() {
    const { toggleModalLinks, isLoading } = this.props;
    const { links, inputLink } = this.state;
    const initialValues = { inputLink };
    return isLoading ? (
      <ModalBody>
        <div className="loading" />
      </ModalBody>
    ) : (
      <>
        <Formik initialValues={initialValues} onSubmit={this.agregarLink}>
          {({ errors, touched }) => (
            <Form className="av-tooltip tooltip-label-right">
              <FormGroup className="form-group has-float-label mb-1 error-l-150">
                <Label>
                  <IntlMessages id="clase.agregar-link" />
                </Label>
                <Field
                  className="form-control"
                  name="link"
                  autoComplete="off"
                  validate={this.validateLink}
                />
                {errors.link && touched.link && (
                  <div className="invalid-feedback d-block">{errors.link}</div>
                )}
              </FormGroup>
              <p className="tip-text-cursiva">
                Ejemplo: http://www.trida.com.ar
              </p>
              <FormGroup className="form-group has-float-label mb-3">
                <Label>
                  <IntlMessages id="clase.descripcion-link" />
                </Label>
                <Field
                  className="form-control"
                  name="descripcion"
                  autoComplete="off"
                />
              </FormGroup>
              <Row className="agregar-btn-row">
                <Button
                  type="submit"
                  className="agregar-btn-link"
                  color="primary"
                >
                  + Agregar
                </Button>
              </Row>
            </Form>
          )}
        </Formik>
        {!isEmpty(links) && (
          <>
            <Separator className="mb-2" />
            <p>Links Agregados</p>
          </>
        )}
        {!isEmpty(links) &&
          links.map((link, index) => {
            return (
              <Row className="lista-links-clase" key={link.link}>
                <a
                  className="link-clase"
                  id={link.link}
                  href={link.link}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {link.descripcion} <br /> {link.link}
                </a>{' '}
                <div
                  className="glyph-icon simple-icon-trash delete-action-icon"
                  onClick={() => this.deleteLink(link.link)}
                />
              </Row>
            );
          })}
        <Separator className="mb-5" />
        <Row className="button-group">
          <Button onClick={toggleModalLinks} className="button" color="primary">
            Cancelar
          </Button>
          <Button onClick={this.editLinks} className="button" color="primary">
            Guardar
          </Button>
        </Row>
      </>
    );
  }
}

export default ModalAsociarLinks;
