import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAILURE,
  USER_LOGOUT,
  USER_PROFILE_REQUEST,
  USER_PROFILE_SUCCESS,
  USER_PROFILE_FAILURE
} from '../types';
import { login as apiLogin, getUser } from '../../api/userApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 登录
export const login = (username, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });
    
    const data = await apiLogin(username, password);
    
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data.user
    });
    
    // 存储token到AsyncStorage
    await AsyncStorage.setItem('token', data.token);
    await AsyncStorage.setItem('userInfo', JSON.stringify(data.user));
    
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAILURE,
      payload: error.message
    });
  }
};

// 登出
export const logout = () => async (dispatch) => {
  // 清除本地存储
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('userInfo');
  
  dispatch({ type: USER_LOGOUT });
};

// 获取用户资料
export const getUserProfile = (userId) => async (dispatch) => {
  try {
    dispatch({ type: USER_PROFILE_REQUEST });
    
    const userInfo = await getUser(userId);
    
    dispatch({
      type: USER_PROFILE_SUCCESS,
      payload: userInfo
    });
    
  } catch (error) {
    dispatch({
      type: USER_PROFILE_FAILURE,
      payload: error.message
    });
  }
}; 