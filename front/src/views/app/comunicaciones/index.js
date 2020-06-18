import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Formales = React.lazy(() =>
  import(/* webpackChunkName: "pages-product" */ './formales')
);
const Foro = React.lazy(() =>
  import(/* webpackChunkName: "pages-profile" */ './foro')
);
const Mensajeria = React.lazy(() =>
  import(/* webpackChunkName: "pages-miscellaneous" */ './mensajeria')
);

const Comunicaciones = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/formales`} />
      <Route
        path={`${match.url}/formales`}
        render={props => <Formales {...props} />}
      />
      <Route
        path={`${match.url}/foro`}
        render={props => <Foro {...props} />}
      />
      <Route
        path={`${match.url}/mensajeria`}
        render={props => <Mensajeria {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default Comunicaciones;
