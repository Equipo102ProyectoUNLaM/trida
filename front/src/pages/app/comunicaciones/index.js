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

const MenuComunicaciones = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Route
        path={`${match.url}/formal`}
        render={props => <Formales {...props} />}
      />
      <Route
        path={`${match.url}/forum`}
        render={props => <Foro {...props} />}
      />
      <Route
        path={`${match.url}/messages`}
        render={props => <Mensajeria {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default MenuComunicaciones;
