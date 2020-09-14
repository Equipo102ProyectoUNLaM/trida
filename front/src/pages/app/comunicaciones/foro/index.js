import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Foro = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './foro')
);
// const DetalleForo = React.lazy(() => import('./detalle-foro/detalle-foro'));
const DetalleForo = React.lazy(() =>
  import(
    /* webpackChunkName: "application-todo" */ './detalle-foro/detalle-foro'
  )
);
const MenuForo = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Route path={`${match.url}/`} render={(props) => <Foro {...props} />} />
      <Route
        path={`${match.url}/detalle-foro/:foroId`}
        render={(props) => <DetalleForo {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default MenuForo;
