import React, { Component, Suspense } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import AppLayout from '../../layout/AppLayout';

const Home = React.lazy(() =>
  import('./home')
);

const ClasesVirtuales = React.lazy(() =>
  import('./clases-virtuales')
);

const Comunicaciones = React.lazy(() =>
  import('./comunicaciones')
);

const Contenidos = React.lazy(() =>
  import('./contenidos')
);

const Correcciones = React.lazy(() =>
  import('./correcciones')
);

const Evaluaciones = React.lazy(() =>
  import('./evaluaciones')
);

const Practicas = React.lazy(() =>
  import('./practicas')
);

class App extends Component {
  render() {
    const { match } = this.props;

    return (
      <AppLayout>
        <div className="dashboard-wrapper">
          <Suspense fallback={<div className="loading" />}>
            <Switch>
              <Redirect exact from={`${match.url}/`} to={`${match.url}/home`} />
              <Route
                path={`${match.url}/home`}
                render={props => <Home {...props} />}
              />
              <Route
                path={`${match.url}/clases-virtuales`}
                render={props => <ClasesVirtuales {...props} />}
              />
              <Route
                path={`${match.url}/contenidos`}
                render={props => <Contenidos {...props} />}
              />
              <Route
                path={`${match.url}/comunicaciones`}
                render={props => <Comunicaciones {...props} />}
              />
              <Route
                path={`${match.url}/correcciones`}
                render={props => <Correcciones {...props} />}
              />

              <Route
                path={`${match.url}/practicas`}
                render={props => <Practicas {...props} />}
              />
              <Route
                path={`${match.url}/evaluaciones`}
                render={props => <Evaluaciones {...props} />}
              />
              <Redirect to="/error" />
            </Switch>
          </Suspense>
        </div>
      </AppLayout>
    );
  }
}
const mapStateToProps = ({ menu }) => {
  const { containerClassnames } = menu;
  return { containerClassnames };
};

export default withRouter(
  connect(
    mapStateToProps,
    {}
  )(App)
);
