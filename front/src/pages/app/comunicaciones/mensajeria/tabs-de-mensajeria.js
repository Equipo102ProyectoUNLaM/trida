import React, { Component } from 'react';
import {
  Row,
  Card,
  CardBody,
  CardHeader,
  Nav,
  NavItem,
  TabContent,
  TabPane,
} from 'reactstrap';
import { NavLink, withRouter } from 'react-router-dom';
import classnames from 'classnames';
import { Colxx } from 'components/common/CustomBootstrap';
import DataTablePagination from 'components/datatable-pagination';
import ReactTable from 'react-table';
import {
  dataSentTableColumns,
  dataReceiveTableColumns,
} from 'constants/messageTableColumns';

class TabsDeMensajeria extends Component {
  constructor(props) {
    super(props);

    this.toggleFirstTab = this.toggleFirstTab.bind(this);
    this.toggleSecondTab = this.toggleSecondTab.bind(this);
    this.state = {
      activeFirstTab: '1',
      activeSecondTab: '1',
    };
  }

  componentDidMount() {}

  toggleFirstTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeFirstTab: tab,
      });
    }
  }

  toggleSecondTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeSecondTab: tab,
      });
    }
  }

  render() {
    const { itemsSent, itemsReceive, clickOnRow } = this.props;
    return (
      <Row lg="12">
        <Colxx xxs="12" xs="12" lg="12">
          <Card className="mb-4">
            <CardHeader className="pl-0 pr-0">
              <Nav tabs className=" card-header-tabs  ml-0 mr-0">
                <NavItem className="w-50 text-center">
                  <NavLink
                    to="#"
                    location={{}}
                    className={classnames({
                      active: this.state.activeSecondTab === '1',
                      'nav-link': true,
                    })}
                    onClick={() => {
                      this.toggleSecondTab('1');
                    }}
                  >
                    Mensajes Recibidos
                  </NavLink>
                </NavItem>
                <NavItem className="w-50 text-center">
                  <NavLink
                    to="#"
                    location={{}}
                    className={classnames({
                      active: this.state.activeSecondTab === '2',
                      'nav-link': true,
                    })}
                    onClick={() => {
                      this.toggleSecondTab('2');
                    }}
                  >
                    Mensajes Enviados
                  </NavLink>
                </NavItem>
              </Nav>
            </CardHeader>
            <TabContent activeTab={this.state.activeSecondTab}>
              <TabPane tabId="1">
                <Row>
                  <Colxx sm="12" lg="12">
                    <CardBody>
                      <ReactTable
                        data={itemsReceive}
                        paginationMaxSize={3}
                        columns={dataReceiveTableColumns}
                        sorted={[{ id: 1, desc: true }]}
                        defaultPageSize={10}
                        showPageJump={itemsReceive.length > 0}
                        showPageSizeOptions={true}
                        noDataText="No tienes mensajes recibidos"
                        PaginationComponent={DataTablePagination}
                        className={'react-table-fixed-height'}
                        getTrGroupProps={(state, rowInfo, column, instance) => {
                          if (rowInfo !== undefined) {
                            return {
                              onClick: (e, handleOriginal) => {
                                clickOnRow(rowInfo);
                              },
                            };
                          }
                        }}
                      />
                    </CardBody>
                  </Colxx>
                </Row>
              </TabPane>
              <TabPane tabId="2">
                <Row>
                  <Colxx sm="12" lg="12">
                    <CardBody>
                      <ReactTable
                        data={itemsSent}
                        paginationMaxSize={3}
                        columns={dataSentTableColumns}
                        sorted={[{ id: 1, desc: true }]}
                        defaultPageSize={10}
                        showPageJump={itemsSent.length > 0}
                        showPageSizeOptions={true}
                        PaginationComponent={DataTablePagination}
                        className={'react-table-fixed-height'}
                        noDataText="No tienes mensajes enviados"
                        getTrGroupProps={(state, rowInfo, column, instance) => {
                          if (rowInfo !== undefined) {
                            return {
                              onClick: (e, handleOriginal) => {
                                clickOnRow(rowInfo);
                              },
                            };
                          }
                        }}
                      />
                    </CardBody>
                  </Colxx>
                </Row>
              </TabPane>
            </TabContent>
          </Card>
        </Colxx>
      </Row>
    );
  }
}

export default withRouter(TabsDeMensajeria);
