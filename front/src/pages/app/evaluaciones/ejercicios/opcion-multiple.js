import React from 'react';
import {
  Row,
  Input,
  ModalFooter,
  Button,
  FormGroup,
  Label,
  NavLink,
  CustomInput,
} from 'reactstrap';
import {
  addDocument,
  editDocument,
  getCollection,
  addDocumentWithSubcollection,
} from 'helpers/Firebase-db';
import ModalConfirmacion from 'containers/pages/ModalConfirmacion';

class OpcionMultiple extends React.Component {
  constructor() {
    super();

    this.state = {
      consigna: '',
      opcion: '',
      verdadera: false,
      opciones: [
        {
          opcion: '',
          verdadera: false,
        },
      ],
    };
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  };

  handleAddOpcion = (e) => {
    console.log(this.state.consigna, this.state.opcion, this.state.verdadera);
    let opcion = {
      opcion: this.state.opcion,
      verdadera: this.state.verdadera,
    };
    this.state.opciones.push(opcion);
  };

  render() {
    //const { onCancel } = this.props;
    //const { modalEditOpen, modalAddOpen, ejercicios } = this.state;
    return (
      <form>
        <FormGroup className="mb-3">
          <Label>Consigna</Label>
          <Input
            name="consigna"
            onChange={this.handleChange}
            value={this.state.consigna}
          />
        </FormGroup>

        <FormGroup className="mb-3">
          <div>
            <p>Agregar opciones</p>
          </div>
          {this.state.opciones.map((op, index) => (
            <Row key={index} className="opcionMultipleRow">
              <Input
                className="opcionMultipleInput"
                name="opcion"
                onChange={this.handleChange}
                value={op.opcion}
              />
              <Input
                name="verdadera"
                type="checkbox"
                onChange={this.handleChange}
                value={op.verdadera}
              />
              <Button
                outline
                onClick={this.handleAddOpcion}
                size="sm"
                color="primary"
                className="button"
              >
                {' '}
                Agregar{' '}
              </Button>
            </Row>
          ))}
        </FormGroup>

        <ModalFooter>
          {!this.props.idEval && (
            <>
              <Button
                color="primary"
                //onClick={this.toggleAddModal}
              >
                Guardar
              </Button>
              <Button
                color="secondary"
                //onClick={onCancel}
              >
                Cancelar
              </Button>
            </>
          )}
        </ModalFooter>
      </form>
    );
  }
}

export default OpcionMultiple;
