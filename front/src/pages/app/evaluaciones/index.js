import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Evaluaciones = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './evaluaciones')
);
const EvaluacionesOrales = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './evaluaciones-orales')
);
const EditarEvaluacion = React.lazy(() =>
  import('./detalle-evaluacion/editar-evaluacion')
);
const AgregarEvaluacion = React.lazy(() =>
  import('./detalle-evaluacion/agregar-evaluacion')
);
const RealizarEvaluacion = React.lazy(() => import('./realizar-evaluacion'));
const OpcionMultiple = React.lazy(() => import('./ejercicios/opcion-multiple'));
const RespuestaLibre = React.lazy(() => import('./ejercicios/respuesta-libre'));

const MenuEvaluaciones = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Route
        exact
        path={`${match.url}/escritas/`}
        render={(props) => <Evaluaciones {...props} />}
      />
      <Route
        path={`${match.url}/escritas/editar-evaluacion/:evaluacionId`}
        render={(props) => <EditarEvaluacion {...props} />}
      />
      <Route
        path={`${match.url}/escritas/agregar`}
        render={(props) => <AgregarEvaluacion {...props} />}
      />
      <Route
        path={`${match.url}/escritas/ejercicios/opcion-multiple`}
        render={(props) => <OpcionMultiple {...props} />}
      />
      <Route
        path={`${match.url}/escritas/ejercicios/respuesta-libre`}
        render={(props) => <RespuestaLibre {...props} />}
      />
      <Route
        path={`${match.url}/escritas/realizar-evaluacion`}
        render={(props) => <RealizarEvaluacion {...props} />}
      />
      <Route
        exact
        path={`${match.url}/orales/`}
        render={(props) => <EvaluacionesOrales {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default MenuEvaluaciones;
