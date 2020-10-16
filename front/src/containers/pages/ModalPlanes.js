import React from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
} from 'reactstrap';
import { connect } from 'react-redux';
import Pricing from 'components/landing/Pricing';
import ModalGrande from 'containers/pages/ModalGrande';

class ModalPlanes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalPlanesOpen: false,
    };
  }

  render() {
    const { isOpen, toggle } = this.props;
    return (
      <ModalGrande
        modalOpen={isOpen}
        toggleModal={this.toggleModal}
        text="Planes de pago"
      >
        <div>
          <Pricing />
        </div>

        <ModalFooter>
          <Button color="secondary" size="sm" onClick={toggle}>
            Cerrar
          </Button>
        </ModalFooter>
      </ModalGrande>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  const { user, error } = authUser;

  return {
    user,
    error,
  };
};

export default connect(mapStateToProps, {})(ModalPlanes);
