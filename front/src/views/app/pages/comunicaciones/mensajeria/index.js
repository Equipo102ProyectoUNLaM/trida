import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Mensajeria = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './mensajeria')
);
const MensajeriaMenu = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/mensajeria`} />
      <Route
        path={`${match.url}/mensajeria`}
        render={props => <Mensajeria {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default MensajeriaMenu;
