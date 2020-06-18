import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Formales = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './formales')
);
const FormalesMenu = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Route
        path={`${match.url}/`}
        render={props => <Formales {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default FormalesMenu;
