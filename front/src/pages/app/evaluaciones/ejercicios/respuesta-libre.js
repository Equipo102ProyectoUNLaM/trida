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

    this.state = {};
  }

  render() {
    return (
      <form>
        <FormGroup className="mb-3">
          <Label>Consigna</Label>
          <Input name="consigna" value={this.state.consigna} />
        </FormGroup>

        <ModalFooter>
          <Button color="primary">Guardar</Button>
          <Button color="secondary">Cancelar</Button>
        </ModalFooter>
      </form>
    );
  }
}

export default OpcionMultiple;
