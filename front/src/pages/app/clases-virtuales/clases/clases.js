import React, { Component, Fragment } from "react";
import { Row, Pagination } from "reactstrap";
import { classData } from "../../../../data/class";
import { injectIntl } from "react-intl";
import ContextMenuContainer from "../../../../containers/pages/ContextMenuContainer";
import HeaderDeModulo from "components/common/HeaderDeModulo";
import ImageListView from "../../../../containers/pages/ImageListView";
import ModalGrande from "containers/pages/ModalGrande";
import FormClase from "./form-clase";

function collect(props) {
  return { data: props.data };
}

class Clase extends Component {

  constructor(props) {
    super(props);
    this.mouseTrap = require("mousetrap");

    this.state = {
        displayMode: "list",
        selectedOrderOption: { column: "title", label: "Título" },
        dropdownSplitOpen: false,
        modalOpen: false,
        modal: false,
        modalLarge: false,
        currentPage: 1,
        totalItemCount: 0,
        totalPage: 1,
        search: "",
        selectedItems: [],
        lastChecked: null,
        isLoading: false
    };
}

componentDidMount() {
    this.dataListRender();
    this.mouseTrap.bind(["ctrl+a", "command+a"], () =>
      this.handleChangeSelectAll(false)
    );
    this.mouseTrap.bind(["ctrl+d", "command+d"], () => {
      this.setState({
        selectedItems: []
      });
      return false;
    });
  }

  componentWillUnmount() {
  }

  toggleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen
    });
  };

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  };

  changeOrderBy = column => {
    this.setState(
      {
        selectedOrderOption: this.state.orderOptions.find(
          x => x.column === column
        )
      },
      () => this.dataListRender()
    );
  };
  changePageSize = size => {
    this.setState(
      {
        selectedPageSize: size,
        currentPage: 1
      },
      () => this.dataListRender()
    );
  };
  changeDisplayMode = mode => {
    this.setState({
      displayMode: mode
    });
    return false;
  };
  onChangePage = page => {
    this.setState(
      {
        currentPage: page
      },
      () => this.dataListRender()
    );
  };

  onSearchKey = e => {
    if (e.key === "Enter") {
      this.setState(
        {
          search: e.target.value.toLowerCase()
        },
        () => this.dataListRender()
      );
    }
  };

  onCheckItem = (event, id) => {
    if (
      event.target.tagName === "A" ||
      (event.target.parentElement && event.target.parentElement.tagName === "A")
    ) {
      return true;
    }
    if (this.state.lastChecked === null) {
      this.setState({
        lastChecked: id
      });
    }

    let selectedItems = this.state.selectedItems;
    if (selectedItems.includes(id)) {
      selectedItems = selectedItems.filter(x => x !== id);
    } else {
      selectedItems.push(id);
    }
    this.setState({
      selectedItems
    });

    if (event.shiftKey) {
      var items = this.state.items;
      var start = this.getIndex(id, items, "id");
      var end = this.getIndex(this.state.lastChecked, items, "id");
      items = items.slice(Math.min(start, end), Math.max(start, end) + 1);
      selectedItems.push(
        ...items.map(item => {
          return item.id;
        })
      );
      selectedItems = Array.from(new Set(selectedItems));
      this.setState({
        selectedItems
      });
    }
    document.activeElement.blur();
  };

  getIndex(value, arr, prop) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i][prop] === value) {
        return i;
      }
    }
    return -1;
  }
  handleChangeSelectAll = isToggle => {
    if (this.state.selectedItems.length >= this.state.items.length) {
      if (isToggle) {
        this.setState({
          selectedItems: []
        });
      }
    } else {
      this.setState({
        selectedItems: this.state.items.map(x => x.id)
      });
    }
    document.activeElement.blur();
    return false;
  };

  dataListRender() {
    const {
      selectedPageSize,
      currentPage,
      selectedOrderOption,
      search
    } = this.state;

    this.setState({
      totalPage: 1,
      items: classData,
      selectedItems: [],
      totalItemCount: 5,
      isLoading: true
    });
  }

  onContextMenuClick = (e, data, target) => {
    console.log(
      "onContextMenuClick - selected items",
      this.state.selectedItems
    );
    console.log("onContextMenuClick - action : ", data.action);
  };

  onContextMenu = (e, data) => {
    const clickedProductId = data.data;
    if (!this.state.selectedItems.includes(clickedProductId)) {
      this.setState({
        selectedItems: [clickedProductId]
      });
    }

    return true;
  };

  render() {
    const {
      modalOpen,
    } = this.state;
    const { match } = this.props;


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
            buttonPrimary="Agregar"
            buttonSecondary="Cancelar"
          >
            <FormClase />
          </ModalGrande>
          <Row>
            {this.state.items.map(product => {
                return (
                  <ImageListView
                    key={product.id}
                    product={product}
                    isSelect={this.state.selectedItems.includes(product.id)}
                    collect={collect}
                    onCheckItem={this.onCheckItem}
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

