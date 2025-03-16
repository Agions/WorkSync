import api from './api';
import dayjs from 'dayjs';

// 获取工作任务
export const getWorkTasks = async (userId = null) => {
  try {
    const query = userId ? `?userId=${userId}` : '';
    const todos = await api.get(`/todos${query}`);
    
    // 为任务添加工时相关字段
    return todos.map(todo => ({
      ...todo,
      estimatedHours: 1 + Math.floor(Math.random() * 8),
      actualHours: todo.completed ? (1 + Math.floor(Math.random() * 8)) : 0,
      startDate: dayjs().subtract(Math.floor(Math.random() * 30), 'day').format('YYYY-MM-DD'),
      taskType: ['regular', 'urgent', 'overtime'][Math.floor(Math.random() * 3)]
    }));
  } catch (error) {
    console.error('获取工作任务失败:', error);
    throw error;
  }
};

// 获取单个任务
export const getTask = async (taskId) => {
  try {
    const task = await api.get(`/todos/${taskId}`);
    // 添加工时相关字段
    return {
      ...task,
      estimatedHours: 1 + Math.floor(Math.random() * 8),
      actualHours: task.completed ? (1 + Math.floor(Math.random() * 8)) : 0,
      startDate: dayjs().subtract(Math.floor(Math.random() * 30), 'day').format('YYYY-MM-DD'),
      taskType: ['regular', 'urgent', 'overtime'][Math.floor(Math.random() * 3)]
    };
  } catch (error) {
    console.error('获取任务详情失败:', error);
    throw error;
  }
};

// 创建任务
export const createTask = async (taskData) => {
  try {
    return await api.post('/todos', taskData);
  } catch (error) {
    console.error('创建任务失败:', error);
    throw error;
  }
};

// 更新任务
export const updateTask = async (taskId, taskData) => {
  try {
    return await api.patch(`/todos/${taskId}`, taskData);
  } catch (error) {
    console.error('更新任务失败:', error);
    throw error;
  }
};

// 删除任务
export const deleteTask = async (taskId) => {
  try {
    return await api.delete(`/todos/${taskId}`);
  } catch (error) {
    console.error('删除任务失败:', error);
    throw error;
  }
};

// 记录工时
export const logWorkTime = async (taskId, hours, workType = 'regular') => {
  try {
    const task = await getTask(taskId);
    const updatedTask = {
      ...task,
      actualHours: (task.actualHours || 0) + hours,
      workType,
      lastUpdated: dayjs().format('YYYY-MM-DD HH:mm:ss')
    };
    return await updateTask(taskId, updatedTask);
  } catch (error) {
    console.error('记录工时失败:', error);
    throw error;
  }
}; 