import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Inicio = React.lazy(() =>
    import(/* webpackChunkName: "start" */ './inicio')
);
const Home = ({ match }) => (
    <Suspense fallback={<div className="loading" />}>
        <Switch>
            <Route
                path={`${match.url}/`}
                render={props => <Inicio {...props} />}
            />
            <Redirect to="/error" />
        </Switch>
    </Suspense>
);
export default Home;