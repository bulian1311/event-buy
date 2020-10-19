import { call, all } from "redux-saga/effects";

export default function* rootSaga(): IterableIterator<any> {
  yield all([
    //call(productsSagas)
  ]);
}