import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Board = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './board')
);
const BoardMenu = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Route
        path={`${match.url}/`}
        render={props => <Board {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default BoardMenu;
