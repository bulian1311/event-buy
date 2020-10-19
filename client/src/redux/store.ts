import { createStore, applyMiddleware, Store, Middleware } from "redux";
import createSagaMiddleware, { SagaMiddleware } from "redux-saga";
import logger from "redux-logger";
import rootReducer from "./root.reducer";
import rootSaga from "./root.saga";

const sagaMiddleware: SagaMiddleware = createSagaMiddleware();

const middlewares: Middleware[] = [sagaMiddleware];

if (process.env.NODE_ENV === "development") middlewares.push(logger);

const store: Store = createStore(rootReducer, applyMiddleware(...middlewares));

sagaMiddleware.run(rootSaga);

export default store;