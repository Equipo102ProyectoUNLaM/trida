import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Start = React.lazy(() =>
    import(/* webpackChunkName: "start" */ './start')
);
const Home = ({ match }) => (
    <Suspense fallback={<div className="loading" />}>
        <Switch>
            <Route
                path={`${match.url}/`}
                render={props => <Start {...props} />}
            />
            <Redirect to="/error" />
        </Switch>
    </Suspense>
);
export default Home;