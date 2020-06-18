import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Board = React.lazy(() =>
  import(/* webpackChunkName: "pages-product" */ './board')
);

const Classes = React.lazy(() =>
  import(/* webpackChunkName: "pages-profile" */ './classes')
);


const ClasesVirtualesMenu = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/classes`} />
      <Route
        path={`${match.url}/classes`}
        render={props => <Classes {...props} />}
      />
      <Route
        path={`${match.url}/board`}
        render={props => <Board {...props} />}
      />      
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default ClasesVirtualesMenu;
