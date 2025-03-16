import {
  TASK_LIST_REQUEST,
  TASK_LIST_SUCCESS,
  TASK_LIST_FAILURE,
  TASK_DETAILS_REQUEST,
  TASK_DETAILS_SUCCESS,
  TASK_DETAILS_FAILURE,
  TASK_CREATE_REQUEST,
  TASK_CREATE_SUCCESS,
  TASK_CREATE_FAILURE,
  TASK_UPDATE_REQUEST,
  TASK_UPDATE_SUCCESS,
  TASK_UPDATE_FAILURE,
  TASK_DELETE_REQUEST,
  TASK_DELETE_SUCCESS,
  TASK_DELETE_FAILURE,
  LOG_WORK_REQUEST,
  LOG_WORK_SUCCESS,
  LOG_WORK_FAILURE
} from '../types';

const initialState = {
  tasks: [],
  task: null,
  loading: false,
  error: null,
  success: false
};

export default function workReducer(state = initialState, action) {
  switch (action.type) {
    case TASK_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case TASK_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        tasks: action.payload,
        error: null
      };
    case TASK_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case TASK_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case TASK_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        task: action.payload,
        error: null
      };
    case TASK_DETAILS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case TASK_CREATE_REQUEST:
      return {
        ...state,
        loading: true,
        success: false,
        error: null
      };
    case TASK_CREATE_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        tasks: [...state.tasks, action.payload],
        error: null
      };
    case TASK_CREATE_FAILURE:
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload
      };
    case TASK_UPDATE_REQUEST:
      return {
        ...state,
        loading: true,
        success: false,
        error: null
      };
    case TASK_UPDATE_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        ),
        task: action.payload,
        error: null
      };
    case TASK_UPDATE_FAILURE:
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload
      };
    case TASK_DELETE_REQUEST:
      return {
        ...state,
        loading: true,
        success: false,
        error: null
      };
    case TASK_DELETE_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        tasks: state.tasks.filter(task => task.id !== action.payload),
        error: null
      };
    case TASK_DELETE_FAILURE:
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload
      };
    case LOG_WORK_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case LOG_WORK_SUCCESS:
      return {
        ...state,
        loading: false,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        ),
        task: action.payload,
        error: null
      };
    case LOG_WORK_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
} 