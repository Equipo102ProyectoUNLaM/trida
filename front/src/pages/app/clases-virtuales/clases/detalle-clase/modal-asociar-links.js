import React from 'react';
import { Separator } from 'components/common/CustomBootstrap';
import {
  Row,
  Button,
  Input,
  FormGroup,
  Label,
  ModalBody,
  NavLink,
} from 'reactstrap';
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

  agregarLink = () => {
    if (this.state.inputLink) {
      if (this.state.links) {
        this.setState({
          links: [...this.state.links, this.state.inputLink],
        });
      } else {
        this.setState({
          links: [this.state.inputLink],
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
    let linksNormalizados = [];
    let links = [...this.state.links];
    links.forEach((link) => {
      return linksNormalizados.push(
        'https://' + link.replace('https://', '').replace('http://', '')
      );
    });
    await editDocument(
      'clases',
      this.props.idClase,
      { links: linksNormalizados },
      'Clase'
    );
    this.props.toggleModalLinks();
    this.props.updateLinks();
  };

  deleteLink = async (index) => {
    let links = [...this.state.links];
    links.splice(index, 1);
    this.setState({
      links,
    });
  };

  render() {
    const { toggleModalLinks, isLoading } = this.props;
    const { links } = this.state;
    return isLoading ? (
      <ModalBody>
        <div className="loading" />
      </ModalBody>
    ) : (
      <>
        <FormGroup className="form-group has-float-label mb-1">
          <Label>
            <IntlMessages id="clase.agregar-link" />
          </Label>
          <Input
            className="form-control"
            name="link"
            onChange={(e) => this.handleInputChange(e)}
          />
        </FormGroup>
        <NavLink className="agregar-btn-link" onClick={this.agregarLink}>
          + Agregar
        </NavLink>
        {!isEmpty(links) && (
          <>
            <Separator className="mb-2" />
            <p>Links Agregados</p>
          </>
        )}
        {!isEmpty(links) &&
          links.map((link, index) => {
            return (
              <Row className="lista-links-clase" key={link}>
                <a
                  className="link-clase"
                  id={link}
                  href={link}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {link} <br />
                </a>{' '}
                <div
                  className="glyph-icon simple-icon-trash delete-action-icon"
                  onClick={() => this.deleteLink(index)}
                />
              </Row>
            );
          })}
        <Separator className="mb-5" />
        <Row className="button-group">
          {!isEmpty(links) && (
            <Button
              onClick={this.editLinks}
              className="button"
              color="primary"
              size="lg"
            >
              Asociar Links
            </Button>
          )}
          <Button
            onClick={toggleModalLinks}
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

export default ModalAsociarLinks;
