import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Row, Collapse, Card, Button, Col } from 'reactstrap';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import Breadcrumb from 'containers/navegacion/Breadcrumb';
import { getCorrecciones, getAsistencias } from 'helpers/DataReportes';
import { DoughnutChart, LineChart } from 'components/charts';
import { ThemeColors } from 'helpers/ThemeColors';
import { isEmpty } from 'helpers/Utils';
const colors = ThemeColors();

class ReportesGenerales extends Component {
  constructor(props) {
    super(props);

    this.state = {
      resumen: [],
      open: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    this.getDataReportes();
  }

  getDataReportes = async () => {
    const { resumen, openData } = await getCorrecciones(this.props.subject.id);
    const resumenTotal = await getAsistencias(this.props.subject.id, resumen);
    this.setState({ resumen: resumenTotal, open: openData, isLoading: false });
  };

  getChartData = (estadisticas) => {
    return {
      labels: Object.keys(estadisticas),
      datasets: [
        {
          label: '',
          borderColor: [
            '#f6c797',
            colors.themeColor3,
            colors.themeColor2,
            colors.themeColor1,
          ],
          backgroundColor: [
            '#f6c7971a',
            colors.themeColor3_10,
            colors.themeColor2_10,
            colors.themeColor1_10,
          ],
          borderWidth: 2,
          data: Object.values(estadisticas).map((list) => list.length),
        },
      ],
    };
  };

  getLineChartData = (estadisticas) => {
    return {
      labels: estadisticas.map((item) => item.nombreClase),
      datasets: [
        {
          label: '',
          data: estadisticas.map((item) => item.tiempo),
          borderColor: colors.themeColor1,
          pointBackgroundColor: colors.foregroundColor,
          pointBorderColor: colors.themeColor1,
          pointHoverBackgroundColor: colors.themeColor1,
          pointHoverBorderColor: colors.foregroundColor,
          pointRadius: 6,
          pointBorderWidth: 2,
          pointHoverRadius: 8,
          fill: false,
        },
      ],
    };
  };

  toggleOpen = () => {
    this.setState({ open: !this.state.open });
  };

  toggleAccordion = (tab) => {
    const prevState = this.state.open;
    const state = prevState.map((x, index) => (tab === index ? !x : x));
    this.setState({
      open: state,
    });
  };

  render() {
    const { resumen, isLoading } = this.state;

    return (
      <Fragment>
        {isLoading && <div className="cover-spin" />}
        <>
          <Row>
            <Colxx xxs="12">
              <Breadcrumb heading="menu.generales" match={this.props.match} />
              <Separator className="mb-5" />
            </Colxx>
          </Row>
          <Row>
            {!isLoading && isEmpty(resumen) && (
              <span>No hay datos sobre reportes generales</span>
            )}
            {!isLoading && !isEmpty(resumen) && (
              <Fragment>
                {resumen.map((item, index) => {
                  return (
                    <Card className="d-flex mb-3" key={index}>
                      <div className="d-flex flex-grow-1 min-width-zero">
                        <Button
                          color="link"
                          className="card-body  btn-empty btn-link list-item-heading text-left text-one"
                          onClick={() => this.toggleAccordion(index)}
                          aria-expanded={this.state.open[index]}
                        >
                          {item.nombreUsuario}
                        </Button>
                      </div>
                      <Collapse isOpen={this.state.open[index]}>
                        <Separator className="mb-4" />
                        <div className="card-body accordion-content pt-0">
                          <Row>
                            {item.estadisticasEval && (
                              <Col>
                                <h3>
                                  Evaluaciones Totales: {item.cantEvalTotal}
                                </h3>
                                <div className="dashboard-donut-chart">
                                  <DoughnutChart
                                    shadow
                                    data={() =>
                                      this.getChartData(item.estadisticasEval)
                                    }
                                  />
                                </div>
                              </Col>
                            )}
                            {item.estadisticasPracticas && (
                              <Col>
                                <h3>
                                  Prácticas Totales: {item.cantPracticasTotal}
                                </h3>
                                <div className="dashboard-donut-chart">
                                  <DoughnutChart
                                    shadow
                                    data={() =>
                                      this.getChartData(
                                        item.estadisticasPracticas
                                      )
                                    }
                                  />
                                </div>
                              </Col>
                            )}
                          </Row>
                          {item.estadisticasClases && (
                            <>
                              <Separator className="mb-4" />
                              <Row>
                                <Col>
                                  <h3 className="mb-1">
                                    Clases Totales: {item.cantClasesTotal}
                                  </h3>
                                  <div className="dashboard-line-chart">
                                    <LineChart
                                      shadow
                                      data={() =>
                                        this.getLineChartData(
                                          item.estadisticasClases
                                        )
                                      }
                                    />
                                  </div>
                                </Col>
                              </Row>
                            </>
                          )}
                        </div>
                      </Collapse>
                    </Card>
                  );
                })}
              </Fragment>
            )}
          </Row>
        </>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ seleccionCurso }) => {
  const { subject } = seleccionCurso;
  return { subject };
};

export default connect(mapStateToProps)(ReportesGenerales);
