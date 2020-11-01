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

const MiPlanilla = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './mi-planilla')
);

const MisPlanillasGuardadas = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './mis-planillas-guardadas')
);

const Reportes = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/clases`} />
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
      <Route
        path={`${match.url}/mi-planilla`}
        render={(props) => <MiPlanilla {...props} />}
      />
      <Route
        path={`${match.url}/mis-planillas-guardadas`}
        render={(props) => <MisPlanillasGuardadas {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default Reportes;
