import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from "redux-saga";
import reducers from './reducers';
import sagas from "./sagas";

const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware];

export function configureStore(initialState) {
    const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;

    const enhancer = composeEnhancers(
        applyMiddleware(...middlewares),
        // other store enhancers if any
      );

    const store = createStore(
        reducers,
        initialState,
        enhancer,
    );

    sagaMiddleware.run(sagas);

    if (module.hot) {
        module.hot.accept('./reducers', () => {
            const nextRootReducer = require('./reducers');
            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
}
