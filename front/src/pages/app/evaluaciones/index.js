import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Evaluaciones = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './evaluaciones')
);
const EditarEvaluacion = React.lazy(() =>
  import('./detalle-evaluacion/editar-evaluacion')
);
const AgregarEvaluacion = React.lazy(() =>
  import('./detalle-evaluacion/agregar-evaluacion')
);
const OpcionMultiple = React.lazy(() => import('./ejercicios/opcion-multiple'));
const RespuestaLibre = React.lazy(() => import('./ejercicios/respuesta-libre'));
const MenuEvaluaciones = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Route
        exact
        path={`${match.url}/`}
        render={(props) => <Evaluaciones {...props} />}
      />
      <Route
        path={`${match.url}/editar-evaluacion/:evaluacionId`}
        render={(props) => <EditarEvaluacion {...props} />}
      />
      <Route
        path={`${match.url}/agregar`}
        render={(props) => <AgregarEvaluacion {...props} />}
      />
      <Route
        path={`${match.url}/ejercicios/opcion-multiple`}
        render={(props) => <OpcionMultiple {...props} />}
      />
      <Route
        path={`${match.url}/ejercicios/respuesta-libre`}
        render={(props) => <RespuestaLibre {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default MenuEvaluaciones;
