import React, { Component, Suspense } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import AppLayout from '../../layout/AppLayout';

const Inicio = React.lazy(() =>
  import(/* webpackChunkName: "viwes-gogo" */ './pages/start/start')
);
const SecondMenu = React.lazy(() =>
  import(/* webpackChunkName: "viwes-second-menu" */ './pages/second-menu')
);
const BlankPage = React.lazy(() =>
  import(/* webpackChunkName: "viwes-blank-page" */ './pages/blank-page')
);

const Correcciones = React.lazy(() =>
  import(/* webpackChunkName: "viwes-blank-page" */ './pages/correcciones')
);

const Foro = React.lazy(() =>
  import(/* webpackChunkName: "viwes-blank-page" */ './pages/comunicaciones/foro')
);

const Mensajeria = React.lazy(() =>
  import(/* webpackChunkName: "viwes-blank-page" */ './pages/comunicaciones/mensajeria')
);

const Formales = React.lazy(() =>
  import(/* webpackChunkName: "viwes-blank-page" */ './pages/comunicaciones/formales')
);

const ClasesVirtuales = React.lazy(() =>
  import(/* webpackChunkName: "viwes-blank-page" */ './pages/clases-virtuales')
);

const Practicas = React.lazy(() =>
  import(/* webpackChunkName: "viwes-blank-page" */ './pages/practicas')
);

const Evaluaciones = React.lazy(() =>
  import(/* webpackChunkName: "viwes-blank-page" */ './pages/evaluaciones')
);

const Contenidos = React.lazy(() =>
  import(/* webpackChunkName: "viwes-blank-page" */ './pages/contenidos')
);


class App extends Component {
  render() {
    const { match } = this.props;

    return (
      <AppLayout>
        <div className="dashboard-wrapper">
          <Suspense fallback={<div className="loading" />}>
            <Switch>
              <Redirect exact from={`${match.url}/`} to={`${match.url}/inicio`} />
              <Route
                path={`${match.url}/inicio`}
                render={props => <Inicio {...props} />}
              />
              <Route
                path={`${match.url}/second-menu`}
                render={props => <SecondMenu {...props} />}
              />
              <Route
                path={`${match.url}/blank-page`}
                render={props => <BlankPage {...props} />}
              />
               <Route
                path={`${match.url}/correcciones`}
                render={props => <Correcciones {...props} />}
              />
               <Route
                path={`${match.url}/foro`}
                render={props => <Foro {...props} />}
              />
               <Route
                path={`${match.url}/mensajeria`}
                render={props => <Mensajeria {...props} />}
              />
                <Route
                path={`${match.url}/formales`}
                render={props => <Formales {...props} />}
              />
              <Route
                path={`${match.url}/clases`}
                render={props => <ClasesVirtuales {...props} />}
              />
              <Route
                path={`${match.url}/practicas`}
                render={props => <Practicas {...props} />}
              />
            <Route
                path={`${match.url}/evaluaciones`}
                render={props => <Evaluaciones {...props} />}
              />
            <Route
                path={`${match.url}/contenidos`}
                render={props => <Contenidos {...props} />}
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
