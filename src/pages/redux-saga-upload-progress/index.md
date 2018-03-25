---
title: Tracking file upload progress with redux-saga event channels & superagent
date: "2018-03-24T12:12:03.284Z"
---

[redux-saga](https://redux-saga.js.org) is great. It allows you to write complex side-effects easily.
One of those more advanced features are [channels](https://redux-saga.js.org/docs/advanced/Channels.html), in particular event channels.
Event channels allow your saga to listen to events from external sources, for example from a websocket connection or as we will see in this example, a file upload request.

---

_Before reading further, make sure you have at least a basic understanding of redux-saga and its event channels. In addition, these examples will be written in TypeScript, since I like playing on hard difficulty_ 😉
_Jokes aside — TypeScript is amazing and you will do yourself a favor if you use it for medium-large sized apps. Give it a [try](https://github.com/Microsoft/TypeScript-React-Starter)!_

---

In this example, we will work with a fictional media upload API.
This API allows the user to upload several kinds of media, but we will start with uploading a Photo. The type definition of a Photo object is as follows:

```typescript
type PhotoType = "selfie" | "landscape" | "macro";

interface IPhoto {
  title: string;
  description?: string;
  photo_type: PhotoType;
}

interface ICreatePhotoPayload extends IPhoto {
  fileobject: File;
}
```

As you can see, we define two interfaces. One for representing an instance of a Photo, and one for creating a new one, which has a `File` object that represents the file being uploaded.

Let's also define how we actually make the request. In this example, we'll be using [superagent](https://github.com/visionmedia/superagent) to handle the AJAX requests. Let's define our requests for our `ApiClient`:

```typescript
import superagent from superagent;

interface IWithFilePayload {
  fileobject: File;
}

export const requests = {
  uploadWithFile: (url: string, payload: IWithFilePayload) => {
    const req = superagent
      .post(`/api/v1/${url}`)
      .attach("fileobject", payload.fileobject);
    for (const key in payload) {
      const value = payload[key as keyof typeof payload];
      if (key !== "fileobject" && value !== undefined) {
        req.field(key, value);
      }
    }
    return req;
  },
};
```

In this example our `requests` object has one function, `uploadWithFile`, which accepts a URL and a payload of type `IWithFilePayload`. This function creates a `superagent` request and attaches the `fileobject` from the payload. Additionally, all other key/value pairs are added as `field`s. Note that this results in a request with `Content-Type: multipart/form-data`.

Since `ICreatePhotoPayload` matches `IWithFilePayload`, we can use it to create a `Photo` specific sub-object to our `ApiClient`:

```typescript
import { requests } from "./index";

export const ApiClient = {
  Photo: {
    create: (payload: ICreatePhotoPayload) =>
      requests.uploadWithFile("content/photos/", payload),
  },
};
```

Now we have an `ApiClient` that can create photos by calling: `ApiClient.Photo.create(payload)`! This will make a `POST` request to our imaginary API at `/api/v1/content/photos/`.

For the Redux part, we'll be using the wonderful [typescript-fsa](https://github.com/aikoven/typescript-fsa) package. This allows us to easily create the required actions for creating a new Photo:

```typescript
import { actionCreatorFactory } from "typescript-fsa";
import { ICreatePhotoPayload, IPhoto } from "./Photo";

const factory = actionCreatorFactory("PHOTOS");

const performCreatePhoto = factory<ICreatePhotoPayload>("PERFORM_CREATE_PHOTO");
const createPhoto = factory.async<ICreatePhotoPayload, IPhoto, Error>(
  "CREATE_PHOTO"
);
```

If you are unfamiliar with [typescript-fsa](https://github.com/aikoven/typescript-fsa), I recommend checking it out. What you need to know for now is that this creates _4_ actions:

1.  `performCreatePhoto (PHOTOS/PERFORM_CREATE_PHOTO)`: This action is the initial trigger for the create photo request. It will be dispatched by a form (which is outside of the scope of this post)
2.  `createPhoto.started (PHOTOS/CREATE_PHOTO_STARTED)`: This action is dispatched by the saga that handles the upload request. It indicates the beginning of the request.
3.  `createPhoto.failed (PHOTOS/CREATE_PHOTO_FAILED)`: This action is dispatched by the saga in case the request failed.
4.  `createPhoto.done (PHOTOS/CREATE_PHOTO_DONE)`: This action is dispatched by the saga when the request has sucessfully completed.

Now that we have some actions, we can create the sagas. First, we will create the watcher saga, which will `takeEvery` `performCreatePhoto` action. Then, it will `call` the worker saga, which is the saga actually responsible for the requests:

```typescript
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
```

So far so good - pretty vanilla redux-saga stuff. Now it's time to add some progress in there!

---

## Making progress

You might be wondering where is the actual progress tracking going on? Let's add that now!

The approach will be to create a redux-saga `eventChannel` to communicate the progress, result and/or error back to the saga.
We can pass our [superagent](https://github.com/visionmedia/superagent) an event handler to handle the progress events. Let's look at our changed `requests`:

```typescript
import { eventChannel, buffers, END, Channel } from "redux-saga";
import _throttle from "lodash-es/throttle";

export const requests = {
  uploadWithFile: (url: string, payload: IWithFilePayload): Channel<any> => {
    return eventChannel(emitter => {
      const onProgress = (e: ProgressEvent) => {
        if (e.lengthComputable) {
          const progress = e.loaded / e.total;
          emitter({ progress });
        }
      };
      const req = superagent
        .post(`/api/v1/${url}`)
        .on("progress", _throttle(onProgress, 500))
        .attach("fileobject", payload.fileobject);
      for (const key in payload) {
        const value = payload[key as keyof typeof payload];
        if (key !== "fileobject" && value !== undefined) {
          req.field(key, value);
        }
      }
      req.then(
        res => {
          emitter({ result: res.body });
          emitter(END);
        },
        err => {
          emitter({ error: err });
          emitter(END);
        }
      );

      return () => {
        req.abort();
      };
    }, buffers.sliding(2));
  },
};
```

Quite a few changes! Let's dive deeper into them:

* Instead of returning the `superagent` request, we're returning the result of the `eventChannel` function from `redux-saga`. This function takes a callback with one argument, the `emitter`. This `emitter` can be used to emit events back to the saga.
* Next, we create a `onProgress` callback which accepts a `ProgressEvent`. If the percent completion can be determined, we use the `emitter` to emit a progress event, with shape `{ progress: number }`.
* Then, we pass this `onProgress` callback to the `superagent` request via `.on("progress")`. For good measure we throw in a Lodash `throttle` so that the callback is only called once every 500ms.
* Since we are now returning the event channel instead of the promise, we have to resolve it ourselves. This is done pretty straight-forwardly by calling `.then()` on the request and passing both the success and error handler. On success, we emit the response body as result, and on error we emit the error. Additionally in both cases we emit the special `END` token afterwards. This signals to the saga that the channel has ended and won't emit any further events. We will see later in the saga code how that is handled.
* We must return an unsubscribe function, which the saga might call in case early termination is desired. For our case, we can simply call `.abort()` on the request to kill it.
* Finally, we're using a sliding buffer of 2. This buffers up to 2 events which is OK for this use case since losing a progress update is not the end of the world.

Before we get into the new saga code, we need to add a new action that can be dispatched when a progress event is emitted.

```typescript
const updateProgress = factory<number>("UPDATE_PROGRESS");
```

Let's now take a look at the updated saga code:

```typescript
function* performCreatePhotoWorker(action: CreatePhotoAction) {
  yield put(createPhoto.started(action.payload));
  // call our API endpoint to create the channel
  const channel = yield call(ApiClient.Photo.create(action.payload));
  try {
    while (true) {
      const { progress, result, error } = yield take(channel);
      if (progress) {
        yield put(updateProgress(progress));
      }
      if (result) {
        yield put(createPhoto.done({ result, params: action.payload }));
        return;
      }
      if (error) {
        yield put(createPhoto.failed({ error, params: action.payload }));
        return;
      }
    }
  } finally {
    // done here
  }
}
```

Let's have a closer look at the changes:

* Instead of calling the API endpoint inside the `try` block, we do it just above to get the event channel.
* Then, inside a `try` block, we start an infinite loop and `yield` a `take` effect on the channel. This causes the saga to block and wait until an event has been emitted through the channel.
* Once an event has been emitted, we deconstruct it into its three possible values, `progress`, `result` or `error`. In case of `progress`, we dispatch an action that will update our progress. And in case of `result` or `error`, we dispatch their respective actions.
* Whenever the request is done (i.e. either `result` or `error` has been emitted through the channel), the special `END` symbol is emitted. This causes the saga to break from the `while (true)` loop, and land in the `finally` block of the `try`. Here we could do additional post-processing if we wanted - but for now that is not required.

This looks pretty good - but what if you have multiple endpoints that need to have this behavior? Can we make it more DRY? Stay tuned for the next post to find out!

### Reading list

* [redux-saga Channels](https://redux-saga.js.org/docs/advanced/Channels.html)
* [superagent](https://visionmedia.github.io/superagent/)
* [typescript-fsa](https://github.com/aikoven/typescript-fsa)
* [File upload progress with redux-saga](https://decembersoft.com/posts/file-upload-progress-with-redux-saga/) - initial inspiration for this post
