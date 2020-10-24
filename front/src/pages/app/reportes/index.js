import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const ReportesClases = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './reportes-clases')
);

const ReportesEvaluaciones = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './reportes-evaluaciones')
);

const ReportesPracticas = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './reportes-practicas')
);

const ReportesGenerales = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './reportes-generales')
);

const Reportes = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Route
        path={`${match.url}/clases`}
        render={(props) => <ReportesClases {...props} />}
      />
      <Route
        path={`${match.url}/evaluaciones`}
        render={(props) => <ReportesEvaluaciones {...props} />}
      />
      <Route
        path={`${match.url}/practicas`}
        render={(props) => <ReportesPracticas {...props} />}
      />
      <Route
        path={`${match.url}/generales`}
        render={(props) => <ReportesGenerales {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default Reportes;
