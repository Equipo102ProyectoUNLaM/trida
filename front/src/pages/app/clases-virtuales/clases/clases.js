import React, { Component, Fragment } from "react";
import { Row } from "reactstrap";
import { classData } from "../../../../data/class";
import { injectIntl } from "react-intl";
import HeaderDeModulo from "components/common/HeaderDeModulo";
import ListaDeClases from "./lista-de-clases";
import ModalGrande from "containers/pages/ModalGrande";
import FormClase from "./form-clase";

function collect(props) {
  return { data: props.data };
}

class Clase extends Component {

  constructor(props) {
    super(props);

    this.state = {
        modalOpen: false,
        selectedItems: [],
        isLoading: false,
    };
}

componentDidMount() {
    this.dataListRender();
  }

  componentWillUnmount() {
  }

  toggleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen
    });
  };

  dataListRender() {
    this.setState({
      items: classData,
      selectedItems: [],
      isLoading: true
    });
  }


  render() {
    const {
      modalOpen,
    } = this.state;

    return !this.state.isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <div className="disable-text-selection">
          <HeaderDeModulo
            heading="menu.my-classes"
            toggleModal={this.toggleModal}
            buttonText="classes.add"
          />
          <ModalGrande
            modalOpen={modalOpen}
            toggleModal={this.toggleModal}
            modalHeader="classes.add"
          >
            <FormClase toggleModal={this.toggleModal}/>
          </ModalGrande>
          <Row>
            {this.state.items.map(product => {
                return (
                  <ListaDeClases
                    key={product.id}
                    product={product}
                    isSelect={this.state.selectedItems.includes(product.id)}
                    collect={collect}
                    navTo = "class-detail"
                  />
                );                
            })}{" "}
          </Row>
        </div>
      </Fragment>
    );
  }
}
export default injectIntl(Clase);

