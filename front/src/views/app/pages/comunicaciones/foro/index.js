import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Foro = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './foro')
);
const ForoMenu = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/foro`} />
      <Route
        path={`${match.url}/foro`}
        render={props => <Foro {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default ForoMenu;
