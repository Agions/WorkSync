import {
  SALARY_LIST_REQUEST,
  SALARY_LIST_SUCCESS,
  SALARY_LIST_FAILURE,
  SALARY_DETAILS_REQUEST,
  SALARY_DETAILS_SUCCESS,
  SALARY_DETAILS_FAILURE,
  YEARLY_SALARY_REQUEST,
  YEARLY_SALARY_SUCCESS,
  YEARLY_SALARY_FAILURE
} from '../types';

const initialState = {
  salaries: [],
  currentSalary: null,
  yearlySalary: null,
  loading: false,
  error: null
};

export default function salaryReducer(state = initialState, action) {
  switch (action.type) {
    case SALARY_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case SALARY_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        salaries: action.payload,
        error: null
      };
    case SALARY_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case SALARY_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case SALARY_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        currentSalary: action.payload,
        error: null
      };
    case SALARY_DETAILS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case YEARLY_SALARY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case YEARLY_SALARY_SUCCESS:
      return {
        ...state,
        loading: false,
        yearlySalary: action.payload,
        error: null
      };
    case YEARLY_SALARY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
} 