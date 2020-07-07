import React, { Fragment, Component } from 'react';
import { Row, Card, CardBody, Jumbotron } from 'reactstrap';
import IntlMessages from '../../helpers/IntlMessages';
import { Colxx } from '../../components/common/CustomBootstrap';
import { withRouter } from 'react-router-dom';
import MediumCardListView from '../../containers/pages/MediumCardListView';
import { firestore } from 'helpers/Firebase';

function collect(props) {
  return { data: props.data };
}

class Institution extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      isLoading: true,
    };
  }

  getInstituciones = async () => {
    const array = [];
    var userId = localStorage.getItem('user_id');
    try {
      const userRef = firestore.doc(`users/${userId}`);
      var userDoc = await userRef.get();
      const { instituciones } = userDoc.data();
      for (const inst of instituciones) {
        const institutionRef = firestore.doc(`${inst.institucion_id.path}`);
        var institutionDoc = await institutionRef.get();
        const { nombre, niveles } = institutionDoc.data();
        const obj = {
          id: inst.institucion_id.id,
          name: nombre,
          tags: niveles,
        };
        array.push(obj);
      }
      this.dataListRenderer(array);
    } catch (err) {
      console.log('Error getting documents', err);
    }
  };

  dataListRenderer(array) {
    this.setState({
      items: array,
      isLoading: false,
    });
  }

  onInstitutionSelected = (institution) => {
    if (institution) {
      localStorage.setItem('institution', JSON.stringify(institution));
    }
  };

  async componentDidMount() {
    await this.getInstituciones();
  }

  render() {
    const { items, isLoading } = this.state;
    return isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <Row className="course-row-container">
          <Colxx xxs="12" className="mb-4 course-col-container">
            <Card className="course-card-center">
              <CardBody>
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
              </CardBody>
            </Card>
          </Colxx>
        </Row>
      </Fragment>
    );
  }
}
export default withRouter(Institution);
