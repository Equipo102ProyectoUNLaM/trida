import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const ClasesVirtuales = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './clases-virtuales')
);
const ClasesVirtualesMenu = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Route
        path={`${match.url}/`}
        render={props => <ClasesVirtuales {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default ClasesVirtualesMenu;
