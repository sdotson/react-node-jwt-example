import axios from 'axios';
import { browserHistory } from 'react-router';
import {
  AUTH_USER,
  AUTH_ERROR,
  UNAUTH_USER,
  FETCH_MESSAGE
} from './types';

const ROOT_URL = 'http://localhost:3090';

export function signinUser({ email, password }) {
  return function(dispatch) {
    // submit email password to server
    axios.post(`${ROOT_URL}/signin`, { email, password })
      .then(response => {
        // if req is good, update state to indicate authentication
        dispatch({ type: AUTH_USER });
        // save jwt token
        localStorage.setItem('token', response.data.token);
        // redirect to the route /feature
        browserHistory.push('/feature');
      })
      .catch((err) => {
        // if request bad, return error to user
        dispatch(authError('Bad login info'));
      });

  }
}

export function signupUser({ email, password }) {
  return function(dispatch) {
    // submit email password to server
    axios.post(`${ROOT_URL}/signup`, { email, password })
      .then(response => {
        // if req is good, update state to indicate authentication
        dispatch({ type: AUTH_USER });
        // save jwt token
        localStorage.setItem('token', response.data.token);
        // redirect to the route /feature
        browserHistory.push('/feature');
      })
      .catch(error => {
        // if request bad, return error to user
        console.log('error', error.response.data.error);
        dispatch(authError(error.response.data.error));
      });

  }
}

export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error
  }
}
export function signoutUser() {
  localStorage.removeItem('token');
  return {
    type: UNAUTH_USER
  }
}

export function fetchMessage() {
  return function(dispatch) {
    // submit email password to server
    axios.get(ROOT_URL, {
        headers: { authorization: localStorage.getItem('token') }
      })
      .then(response => {
        console.log('action creator',response.data.message);
        dispatch({
          type: FETCH_MESSAGE,
          payload: response.data.message
        });
      })
      .catch((err) => {
        // if request bad, return error to user
        dispatch(authError('Bad login info'));
      });

  }
}
