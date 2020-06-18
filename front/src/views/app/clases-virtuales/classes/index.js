import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const ClasesVirtuales = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './clases-virtuales')
);

const ClassDetail = React.lazy(() =>
  import(/* webpackChunkName: "application-todo" */ './class-detail')
);


const ClasesVirtualesMenu = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
    <Redirect exact from={`${match.url}/`} to={`${match.url}/clases-virtuales`} />
      <Route
        path={`${match.url}/clases-virtuales`}
        render={props => <ClasesVirtuales {...props} />}
      />
      <Route
        path={`${match.url}/class-detail`}
        render={props => <ClassDetail {...props} />}
        isExact
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default ClasesVirtualesMenu;
