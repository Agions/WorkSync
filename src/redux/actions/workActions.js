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
import {
  getWorkTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  logWorkTime
} from '../../api/workApi';

// 获取任务列表
export const listTasks = (userId = null) => async (dispatch) => {
  try {
    dispatch({ type: TASK_LIST_REQUEST });
    
    const tasks = await getWorkTasks(userId);
    
    dispatch({
      type: TASK_LIST_SUCCESS,
      payload: tasks
    });
    
  } catch (error) {
    dispatch({
      type: TASK_LIST_FAILURE,
      payload: error.message
    });
  }
};

// 获取任务详情
export const getTaskDetails = (taskId) => async (dispatch) => {
  try {
    dispatch({ type: TASK_DETAILS_REQUEST });
    
    const task = await getTask(taskId);
    
    dispatch({
      type: TASK_DETAILS_SUCCESS,
      payload: task
    });
    
  } catch (error) {
    dispatch({
      type: TASK_DETAILS_FAILURE,
      payload: error.message
    });
  }
};

// 创建任务
export const addTask = (taskData) => async (dispatch) => {
  try {
    dispatch({ type: TASK_CREATE_REQUEST });
    
    const createdTask = await createTask(taskData);
    
    dispatch({
      type: TASK_CREATE_SUCCESS,
      payload: createdTask
    });
    
  } catch (error) {
    dispatch({
      type: TASK_CREATE_FAILURE,
      payload: error.message
    });
  }
};

// 更新任务
export const editTask = (taskId, taskData) => async (dispatch) => {
  try {
    dispatch({ type: TASK_UPDATE_REQUEST });
    
    const updatedTask = await updateTask(taskId, taskData);
    
    dispatch({
      type: TASK_UPDATE_SUCCESS,
      payload: updatedTask
    });
    
  } catch (error) {
    dispatch({
      type: TASK_UPDATE_FAILURE,
      payload: error.message
    });
  }
};

// 删除任务
export const removeTask = (taskId) => async (dispatch) => {
  try {
    dispatch({ type: TASK_DELETE_REQUEST });
    
    await deleteTask(taskId);
    
    dispatch({
      type: TASK_DELETE_SUCCESS,
      payload: taskId
    });
    
  } catch (error) {
    dispatch({
      type: TASK_DELETE_FAILURE,
      payload: error.message
    });
  }
};

// 记录工时
export const logWork = (taskId, hours, workType) => async (dispatch) => {
  try {
    dispatch({ type: LOG_WORK_REQUEST });
    
    const updatedTask = await logWorkTime(taskId, hours, workType);
    
    dispatch({
      type: LOG_WORK_SUCCESS,
      payload: updatedTask
    });
    
  } catch (error) {
    dispatch({
      type: LOG_WORK_FAILURE,
      payload: error.message
    });
  }
}; 