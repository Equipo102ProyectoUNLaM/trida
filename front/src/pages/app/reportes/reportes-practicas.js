import React, { Component, Fragment } from 'react';
import { Row } from 'reactstrap';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import Breadcrumb from 'containers/navegacion/Breadcrumb';

export default class ReportesPracticas extends Component {
  render() {
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <Breadcrumb
              heading="menu.my-reportes-practicas"
              match={this.props.match}
            />
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        {isEmpty(dataPracticas) && <span>No hay datos sobre prácticas</span>}
        {!isEmpty(dataPracticas) && (
          <TableContainer component={Paper}>
            {dataPracticas.map((row, index) => (
              <Fragment key={index}>
                <TableRow className="mb-2">
                  <TableCell className="button-toggle">
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() => this.toggleAccordion(index)}
                    >
                      {open ? (
                        <KeyboardArrowDownIcon />
                      ) : (
                        <KeyboardArrowUpIcon />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell
                    className="width-100 font-weight-bold"
                    onClick={() => this.toggleAccordion(index)}
                  >
                    {row.id}
                  </TableCell>
                  <TableCell
                    className="width-100"
                    onClick={() => this.toggleAccordion(index)}
                  >
                    Cantidad de Entregas: {row.data.length}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={5}
                    className="padding-left-inner"
                  >
                    <Collapse in={open[index]} timeout="auto">
                      <Box margin={1}>
                        <Table
                          className="data-entregas"
                          size="small"
                          aria-label="entregas"
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell className="font-weight-bold">
                                Práctica
                              </TableCell>
                              <TableCell className="font-weight-bold">
                                Fecha de Entrega
                              </TableCell>
                              <TableCell className="font-weight-bold">
                                Estado
                              </TableCell>
                              <TableCell className="font-weight-bold">
                                Nota
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {row.data.map((historyRow) => (
                              <TableRow
                                key={historyRow.id}
                                className={historyRow.estado}
                              >
                                <TableCell component="th" scope="row">
                                  {historyRow.nombrePractica}
                                </TableCell>
                                <TableCell>{historyRow.fecha}</TableCell>
                                <TableCell>{historyRow.estado}</TableCell>
                                <TableCell>
                                  {historyRow.nota === 0
                                    ? '-'
                                    : historyRow.nota}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </Fragment>
            ))}
          </TableContainer>
        )}
      </Fragment>
    );
  }
}
