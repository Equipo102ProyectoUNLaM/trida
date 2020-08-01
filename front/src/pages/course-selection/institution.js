import React, { Fragment, Component } from 'react';
import { Row, Card, CardBody, Jumbotron, Button } from 'reactstrap';
import IntlMessages from '../../helpers/IntlMessages';
import { Colxx } from '../../components/common/CustomBootstrap';
import { withRouter } from 'react-router-dom';
import MediumCardListView from '../../containers/pages/MediumCardListView';
import { firestore } from 'helpers/Firebase';
import { connect } from 'react-redux';
import { logoutUser } from '../../redux/actions';
import { getInstitucionesDeUsuario } from 'helpers/Firebase-user';

function collect(props) {
  return { data: props.data };
}

const mapStateToProps = ({ authUser }) => {
  const { user } = authUser;
  return {
    user,
  };
};

class Institution extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      isLoading: true,
      isEmpty: false,
      userId: localStorage.getItem('user_id'),
    };
  }

  getInstituciones = async (userId) => {
    try {
      const inst = await getInstitucionesDeUsuario(userId);
      this.dataListRenderer(inst);
    } catch (err) {
      console.log('Error', err);
    }
  };

  dataListRenderer(array) {
    this.setState({
      items: array,
      isLoading: false,
      isEmpty: array.length === 0 ? true : false,
    });
  }

  onInstitutionSelected = (institution) => {
    if (institution) {
      localStorage.setItem('institution', JSON.stringify(institution));
    }
  };

  async componentDidMount() {
    await this.getInstituciones(this.state.userId);
  }

  handleLogout = () => {
    this.props.logoutUser(this.props.history);
  };

  render() {
    const { items, isLoading, isEmpty } = this.state;
    return isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <Row className="course-row-container">
          <Colxx xxs="12" className="mb-4 course-col-container">
            <Card className="course-card-center">
              <CardBody>
                {isEmpty === false && (
                  <Jumbotron>
                    <h2 className="display-5">
                      <IntlMessages id="institution.selection" />
                    </h2>
                    <hr className="my-4" />
                    <Row>
                      {items.map((institution) => {
                        return (
                          <MediumCardListView
                            key={institution.id}
                            item={institution}
                            collect={collect}
                            onClick={(e) =>
                              this.onInstitutionSelected(institution)
                            }
                            navTo={`course/${institution.id}`}
                          />
                        );
                      })}{' '}
                    </Row>
                  </Jumbotron>
                )}
                {isEmpty === true && (
                  <Colxx>
                    <h3 className="text-center">
                      El usuario con el que ingresaste no posee instituciones
                      asociadas.
                    </h3>
                    <h3 className="text-center">
                      Cerrá sesión para ingresar con otro usuario
                    </h3>
                    <Button
                      color="primary"
                      onClick={() => this.handleLogout()}
                      block
                      className="mb-2"
                    >
                      Cerrar sesión
                    </Button>
                  </Colxx>
                )}
              </CardBody>
            </Card>
          </Colxx>
        </Row>
      </Fragment>
    );
  }
}
export default withRouter(
  connect(mapStateToProps, {
    logoutUser,
  })(Institution)
);
