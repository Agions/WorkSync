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
import {
  generateSalaryRecords,
  getUserSalaryRecords,
  getCurrentMonthSalary,
  calculateYearlySalary
} from '../../api/salaryApi';

// 获取薪资列表
export const listSalaries = (userId) => async (dispatch) => {
  try {
    dispatch({ type: SALARY_LIST_REQUEST });
    
    const salaries = await getUserSalaryRecords(userId);
    
    dispatch({
      type: SALARY_LIST_SUCCESS,
      payload: salaries
    });
    
  } catch (error) {
    dispatch({
      type: SALARY_LIST_FAILURE,
      payload: error.message
    });
  }
};

// 获取当月薪资
export const getCurrentSalary = (userId) => async (dispatch) => {
  try {
    dispatch({ type: SALARY_DETAILS_REQUEST });
    
    const salary = await getCurrentMonthSalary(userId);
    
    dispatch({
      type: SALARY_DETAILS_SUCCESS,
      payload: salary
    });
    
  } catch (error) {
    dispatch({
      type: SALARY_DETAILS_FAILURE,
      payload: error.message
    });
  }
};

// 获取年度薪资
export const getYearlySalary = (userId, year = '2023') => async (dispatch) => {
  try {
    dispatch({ type: YEARLY_SALARY_REQUEST });
    
    const yearSalary = await calculateYearlySalary(userId, year);
    
    dispatch({
      type: YEARLY_SALARY_SUCCESS,
      payload: yearSalary
    });
    
  } catch (error) {
    dispatch({
      type: YEARLY_SALARY_FAILURE,
      payload: error.message
    });
  }
}; 