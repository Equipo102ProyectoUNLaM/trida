import React, { Component, Suspense } from 'react';
import { connect } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  withRouter,
} from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import './helpers/Firebase';
import AppLocale from './lang';
import ColorSwitcher from './components/common/ColorSwitcher';
import NotificationContainer from './components/common/react-notifications/NotificationContainer';
import { isMultiColorActive } from './constants/defaultValues';
import { getDirection } from './helpers/Utils';
import { AuthRoute } from 'components/rutas/auth-route';

const ViewMain = React.lazy(() =>
  import(/* webpackChunkName: "views" */ './pages')
);
const ViewApp = React.lazy(() =>
  import(/* webpackChunkName: "views-app" */ './pages/app')
);
const ViewCourse = React.lazy(() =>
  import(/* webpackChunkName: "views-user" */ './pages/course-selection')
);
const ViewUser = React.lazy(() =>
  import(/* webpackChunkName: "views-user" */ './pages/user')
);
const ViewError = React.lazy(() =>
  import(/* webpackChunkName: "views-error" */ './pages/error')
);
const ViewPizarron = React.lazy(() =>
  import(/* webpackChunkName: "views-error" */ './pages/window-pizarron')
);

const Action = React.lazy(() =>
  import(/* webpackChunkName: "views-error" */ 'templates/email/action')
);
const ViewLanding = React.lazy(() =>
  import(/* webpackChunkName: "views-error" */ './pages/landing')
);

class App extends Component {
  constructor(props) {
    super(props);
    const direction = getDirection();
    if (direction.isRtl) {
      document.body.classList.add('rtl');
      document.body.classList.remove('ltr');
    } else {
      document.body.classList.add('ltr');
      document.body.classList.remove('rtl');
    }
  }

  /*   componentDidMount(prevProps) {
    const { primerLogin, cambiarPassword } = this.props;

    if (!prevProps) {
      console.log('aca en app mount');
      if (cambiarPassword) {
        return <Redirect to="/user/cambiar-password" />;
      }

      if (primerLogin) {
        return <Redirect to="/user/primer-login" />;
      }
      console.log('acaa mount');
      return this.props.history.push('/');
    }
  } */

  componentDidUpdate(prevProps) {
    const { primerLogin, cambiarPassword } = this.props;

    if (!prevProps.loginUser && this.props.loginUser) {
      console.log('aca en app upd');
      if (cambiarPassword) {
        return <Redirect to="/user/cambiar-password" />;
      }

      if (primerLogin) {
        return <Redirect to="/user/primer-login" />;
      }
      console.log('acaa upd');
      return this.props.history.push('/seleccion-curso');
    }
  }

  render() {
    const { locale, loginUser } = this.props;
    const currentAppLocale = AppLocale[locale];

    return (
      <div className="h-100">
        <IntlProvider
          locale={currentAppLocale.locale}
          messages={currentAppLocale.messages}
        >
          <React.Fragment>
            <NotificationContainer />
            {isMultiColorActive && <ColorSwitcher />}
            <Suspense fallback={<div className="loading" />}>
              <Router>
                <Switch>
                  <Route
                    path="/"
                    exact
                    render={(props) => <ViewLanding {...props} />}
                  />
                  <AuthRoute
                    path="/seleccion-curso"
                    authUser={loginUser}
                    component={ViewCourse}
                  />
                  <AuthRoute
                    path="/app"
                    authUser={loginUser}
                    component={ViewApp}
                  />
                  <AuthRoute
                    path="/pizarron"
                    authUser={loginUser}
                    component={ViewPizarron}
                  />
                  <Route
                    path="/user"
                    render={(props) => <ViewUser {...props} />}
                  />
                  <Route
                    path="/error"
                    exact
                    render={(props) => <ViewError {...props} />}
                  />
                  <Route path="/action" component={Action} />
                  <Redirect to="/error" />
                </Switch>
              </Router>
            </Suspense>
          </React.Fragment>
        </IntlProvider>
      </div>
    );
  }
}

const mapStateToProps = ({ authUser, settings }) => {
  const { user: loginUser, userData } = authUser;
  const { cambiarPassword, primerLogin } = userData;
  const { locale } = settings;
  return { loginUser, locale, cambiarPassword, primerLogin };
};
const mapActionsToProps = {};

export default withRouter(connect(mapStateToProps, mapActionsToProps)(App));
