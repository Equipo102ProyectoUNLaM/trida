import React, { Component, Suspense } from 'react';
import { connect } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
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
  import(/* webpackChunkName: "views-error" */ './pages/landing/landing')
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
                    path="/landing"
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
                  <AuthRoute
                    path="/"
                    authUser={loginUser}
                    exact
                    component={ViewMain}
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
  const { user: loginUser } = authUser;
  const { locale } = settings;
  return { loginUser, locale };
};
const mapActionsToProps = {};

export default connect(mapStateToProps, mapActionsToProps)(App);
