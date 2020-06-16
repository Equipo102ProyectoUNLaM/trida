import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Practicas = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './practicas')
);
const PracticasMenu = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Route
        path={`${match.url}/`}
        render={props => <Practicas {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default PracticasMenu;
