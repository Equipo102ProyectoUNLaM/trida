import React, { Fragment, Component } from "react";
import { Row, Card, CardBody, Jumbotron, Button } from "reactstrap";
import IntlMessages from "../../helpers/IntlMessages";
import { Colxx } from "../../components/common/CustomBootstrap";
import { withRouter } from 'react-router-dom';
import InstitutionListView from '../../containers/pages/InstitutionListView';
import { institutions } from './../../data/institutions';

function collect(props) {
    return { data: props.data };
}

class Institution extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items: institutions
        }
    }
    render() {
        return (<Fragment>
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
                                    {this.state.items.map(institution => {
                                        return (
                                            <InstitutionListView
                                                key={institution.id}
                                                institution={institution}
                                                collect={collect}
                                                navTo="course"
                                            />
                                        );
                                    })}{" "}
                                </Row>
                            </Jumbotron>
                        </CardBody>
                    </Card>
                </Colxx>
            </Row>
        </Fragment>);
    }
}
export default withRouter(Institution);
