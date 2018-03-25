import { call, takeLatest, put } from "redux-saga/effects";
import { createPhoto, CreatePhotoAction } from "./actions";
import { ApiClient } from "./ApiClient";

function* perfomCreatePhotoWatcher() {
  yield takeLatest(perfomCreate, performCreatePhotoWorker);
}

function* performCreatePhotoWorker(action: CreatePhotoAction) {
  // indicate that we start the request
  yield put(createPhoto.started(action.payload));
  // invoke the request
  try {
    const result = yield call(ApiClient.Photo.create(action.payload));
    // if we end up here the request went all good
    yield put(createPhoto.done({ result, params: action.payload }));
  } catch (error) {
    // if not, we have to dispatch the failed action
    yield put(createPhoto.failed({ error, params: action.payload }));
  }
}
