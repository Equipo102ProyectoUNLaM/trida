import React, { Component, Fragment } from 'react';
import { Row } from 'reactstrap';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import ModalGrande from 'containers/pages/ModalGrande';
import { practicasData } from './../../../data/practicas';
import DataListView from 'containers/pages/DataListView';

function collect(props) {
  return { data: props.data };
}

class Practicas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      selectedItems: [],
      isLoading: false,
      items: [],
    };
  }

  componentDidMount() {
    this.practicasRender();
  }

  toggleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen,
    });
  };

  practicasRender() {
    this.setState({
      modalOpen: false,
      items: practicasData,
      selectedItems: [],
      isLoading: true,
    });
  }

  deleteItem = () => {
    alert('delete');
  };

  editItem = () => {
    alert('edit');
  };

  render() {
    const { modalOpen } = this.state;

    return !this.state.isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <div className="disable-text-selection">
          <HeaderDeModulo
            heading="menu.my-activities"
            toggleModal={this.toggleModal}
            buttonText="activity.add"
          />
          <ModalGrande
            modalOpen={modalOpen}
            toggleModal={this.toggleModal}
            modalHeader="activity.add"
          ></ModalGrande>
          <Row>
            {this.state.items.map((practica) => {
              return (
                <DataListView
                  key={practica.id + 'dataList'}
                  id={practica.id}
                  title={practica.description}
                  text1={
                    'Fecha de publicación: ' +
                    practica.publicationDate.toLocaleDateString()
                  }
                  text2={
                    'Fecha de entrega: ' + practica.dueDate.toLocaleDateString()
                  }
                  isSelect={this.state.selectedItems.includes(practica.id)}
                  onEditItem={this.editItem}
                  onDeleteItem={this.deleteItem}
                  navTo=""
                  collect={collect}
                />
              );
            })}{' '}
          </Row>
        </div>
      </Fragment>
    );
  }
}
export default Practicas;
