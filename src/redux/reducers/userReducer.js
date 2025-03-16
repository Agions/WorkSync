import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAILURE,
  USER_LOGOUT,
  USER_PROFILE_REQUEST,
  USER_PROFILE_SUCCESS,
  USER_PROFILE_FAILURE
} from '../types';

const initialState = {
  userInfo: null,
  loading: false,
  error: null,
  isAuthenticated: false
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case USER_LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        userInfo: action.payload,
        isAuthenticated: true,
        error: null
      };
    case USER_LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case USER_LOGOUT:
      return {
        ...initialState
      };
    case USER_PROFILE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case USER_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        userInfo: action.payload,
        error: null
      };
    case USER_PROFILE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
} 