# redux-async-catch
Async error catch middleware for Redux

[![npm version](https://img.shields.io/npm/v/redux-async-catch.svg?style=flat-square)](https://www.npmjs.com/package/redux-async-catch)

```sh
yarn add redux-async-catch
```

## Installation

```sh
yarn add redux-async-catch redux-thunk
```

Then, update your store configuration:

```js
import { createStore, applyMiddleware } from 'redux';
import asyncCatch from 'redux-async-catch';
import thunk from 'redux-thunk';
import fetchError from './actions/index';
import rootReducer from './reducers/index';

const store = createStore(
  rootReducer,
  applyMiddleware(
      // Note: asyncCatch must be applied before thunk
      asyncCatch(fetchError),
      thunk
  )

);
```

- `asyncCatch` receive a thunk action that will receive catched `error` and `lastAction` as a arguments

## Example

Handle `401` error code in your Application and refresh user token.

```js
// actions:

export const fetchUserData = () => async function (dispatch, getState) {
    // You don't need to use try/catch anymore,
    // all your errors will be handled in fetchError action
    const user = await fetch('/api/me');
};

export const refreshUserToken = () => async function (dispatch, getState) {
    // somme logic
};

export const fetchError = (e, lastAction) => function (dispatch, getState) {
    switch (e.status) {

        // when fetchUserData action was called and you got 401 
        // (user token has been expired), you can refresh token and 
        // dispatch lastAction again
        case 401: {
            dispatch(refreshUserToken());
            dispatch(lastAction);
            break;
        }

        default: {
            console.error(e);
        }
    }
};

// also you can create your own catch implementation for some actions:
export const fetchSomeOther = () => async function (dispatch, getState) {
    try {
        const user = await fetch('/api/some/other');
    } catch (e) {
        if (e.status === '404') {
            // some logic
        } else {
            throw e;
        }
    }
};

``` 

## License

MIT

