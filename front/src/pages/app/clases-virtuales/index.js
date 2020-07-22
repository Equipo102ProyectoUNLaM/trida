import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Board = React.lazy(() =>
  import(/* webpackChunkName: "pages-product" */ './pizarron')
);

const MyClasses = React.lazy(() =>
  import(/* webpackChunkName: "pages-profile" */ './clases')
);

const PizarronCompartido = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './pizarron-compartido')
);

const VirtualClassesMenu = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/mis-clases`} />
      <Route
        path={`${match.url}/mis-clases`}
        render={(props) => <MyClasses {...props} />}
      />
      <Route
        path={`${match.url}/pizarron`}
        render={(props) => <Board {...props} />}
      />
      <Route
        path={`${match.url}/pizarron-compartido`}
        component={PizarronCompartido}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default VirtualClassesMenu;
