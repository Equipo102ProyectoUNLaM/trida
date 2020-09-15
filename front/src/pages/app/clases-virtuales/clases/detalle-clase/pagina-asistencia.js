import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getDocument } from 'helpers/Firebase-db';
import { isEmpty } from 'helpers/Utils';
import DataTablePagination from 'components/datatable-pagination';
import ReactTable from 'react-table';
import { DATA_TABLE_COLUMNS } from 'constants/asistenciaTableColumns';

class PaginaAsistencia extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { asistencia } = this.props;
    return (
      <>
        {isEmpty(asistencia) && <span>No hay datos de asistencia</span>}
        {!isEmpty(asistencia) && (
          <ReactTable
            data={asistencia}
            paginationMaxSize={3}
            columns={DATA_TABLE_COLUMNS}
            sorted={[{ id: 1, desc: true }]}
            defaultPageSize={10}
            showPageJump={asistencia.length > 0}
            showPageSizeOptions={true}
            PaginationComponent={DataTablePagination}
            className={'react-table-fixed-height'}
          />
        )}
      </>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  const { userData } = authUser;
  const { nombre, apellido, rol } = userData;
  return {
    nombre,
    apellido,
    rol,
  };
};

export default connect(mapStateToProps)(PaginaAsistencia);
