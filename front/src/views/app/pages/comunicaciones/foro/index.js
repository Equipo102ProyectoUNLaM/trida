import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Foro = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './foro')
);
const ForoMenu = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Route
        path={`${match.url}/`}
        render={props => <Foro {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default ForoMenu;
