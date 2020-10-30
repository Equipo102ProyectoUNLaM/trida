import React, { Component, Suspense } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { preguntarPermisos, messaging } from 'helpers/Firebase';

import AppLayout from '../../layout/AppLayout';

const Home = React.lazy(() => import('./home'));

const Reportes = React.lazy(() => import('./reportes'));

const VirtualClasses = React.lazy(() => import('./clases-virtuales'));

const Communications = React.lazy(() => import('./comunicaciones'));

const Content = React.lazy(() => import('./contenidos'));

const Corrections = React.lazy(() => import('./correcciones'));

const Cuenta = React.lazy(() => import('./cuenta'));

const Evaluations = React.lazy(() => import('./evaluaciones'));

const Activities = React.lazy(() => import('./practicas'));

const Admin = React.lazy(() => import('./admin'));

const Ayuda = React.lazy(() => import('./ayuda'));

class App extends Component {
  componentDidMount() {
    // preguntarPermisos();
    // navigator.serviceWorker.addEventListener('message', (message) =>
    //   console.log(message)
    // );
  }

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
                render={(props) => <Home {...props} />}
              />
              <Route
                path={`${match.url}/clases-virtuales`}
                render={(props) => <VirtualClasses {...props} />}
              />
              <Route
                path={`${match.url}/contenidos`}
                render={(props) => <Content {...props} />}
              />
              <Route
                path={`${match.url}/comunicaciones`}
                render={(props) => <Communications {...props} />}
              />
              <Route
                path={`${match.url}/correcciones`}
                render={(props) => <Corrections {...props} />}
              />
              <Route
                path={`${match.url}/cuenta`}
                render={(props) => <Cuenta {...props} />}
              />

              <Route
                path={`${match.url}/practicas`}
                render={(props) => <Activities {...props} />}
              />
              <Route
                path={`${match.url}/evaluaciones`}
                render={(props) => <Evaluations {...props} />}
              />
              <Route
                path={`${match.url}/admin`}
                render={(props) => <Admin {...props} />}
              />
              <Route
                path={`${match.url}/reportes`}
                render={(props) => <Reportes {...props} />}
              />
              <Route
                path={`${match.url}/ayuda`}
                render={(props) => <Ayuda {...props} />}
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

export default withRouter(connect(mapStateToProps, {})(App));
