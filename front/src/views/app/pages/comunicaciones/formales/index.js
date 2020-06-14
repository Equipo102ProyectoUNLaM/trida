import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Formales = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './formales')
);
const FormalesMenu = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/formales`} />
      <Route
        path={`${match.url}/formales`}
        render={props => <Formales {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default FormalesMenu;
