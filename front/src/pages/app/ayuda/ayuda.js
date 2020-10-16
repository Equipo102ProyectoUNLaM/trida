import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Row, Collapse, Card, Button } from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import ayudaDocente from 'constants/ayuda/ayudaDocente';
import ayudaAlumno from 'constants/ayuda/ayudaAlumno';
import ayudaDirectivo from 'constants/ayuda/ayudaDirectivo';
import { injectIntl } from 'react-intl';
import IntlMessages from 'helpers/IntlMessages';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import ROLES from 'constants/roles';

class PaginaAyuda extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapse: false,
      accordion: [],
      data: [],
    };
  }

  componentDidMount() {
    const { rol } = this.props;
    let accordionData = [];

    switch (rol) {
      case ROLES.Docente:
        ayudaDocente.forEach(() => {
          accordionData.push(false);
        });
        this.setState({
          collapse: false,
          accordion: accordionData,
          data: ayudaDocente,
        });
        break;
      case ROLES.Alumno:
        ayudaAlumno.forEach(() => {
          accordionData.push(false);
        });
        this.setState({
          collapse: false,
          accordion: accordionData,
          data: ayudaAlumno,
        });
        break;
      case ROLES.Directivo:
        ayudaDirectivo.forEach(() => {
          accordionData.push(false);
        });
        this.setState({
          collapse: false,
          accordion: accordionData,
          data: ayudaDirectivo,
        });
        break;
    }
  }

  toggleAccordion = (tab) => {
    const prevState = this.state.accordion;
    const state = prevState.map((x, index) => (tab === index ? !x : false));
    this.setState({
      accordion: state,
    });
  };

  render() {
    const { data } = this.state;
    return (
      <>
        <HeaderDeModulo
          heading="menu.ayuda"
          toggleModal={() => this.props.history.push('/app/home')}
          buttonText="menu.volver"
        />
        <Row className="mb-3 ml-0">
          <IntlMessages id="ayuda.bienvenido" />{' '}
          <IntlMessages id="ayuda.bienvenido-subtitulo" />
        </Row>
        <Row>
          <Colxx xxs="12" className="mb-4">
            <Fragment>
              {data.map((item, index) => {
                return (
                  <Card className="d-flex mb-3" key={index}>
                    <div className="d-flex flex-grow-1 min-width-zero">
                      <Button
                        color="link"
                        className="card-body  btn-empty btn-link list-item-heading text-left text-one"
                        onClick={() => this.toggleAccordion(index)}
                        aria-expanded={this.state.accordion[index]}
                      >
                        {item.question}
                      </Button>
                    </div>
                    <Collapse isOpen={this.state.accordion[index]}>
                      <div
                        className="card-body accordion-content pt-0"
                        dangerouslySetInnerHTML={{ __html: item.answer }}
                      />
                    </Collapse>
                  </Card>
                );
              })}
            </Fragment>
          </Colxx>
        </Row>
      </>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  const { userData } = authUser;
  const { rol } = userData;
  return {
    rol,
  };
};

export default injectIntl(connect(mapStateToProps)(PaginaAyuda));
