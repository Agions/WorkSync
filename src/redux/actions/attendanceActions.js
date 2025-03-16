import { attendanceApi } from '../../services/attendanceApi';
import { 
  ATTENDANCE_REQUEST, 
  ATTENDANCE_SUCCESS, 
  ATTENDANCE_FAILURE,
  CLOCK_IN_REQUEST,
  CLOCK_IN_SUCCESS,
  CLOCK_IN_FAILURE,
  CLOCK_OUT_REQUEST,
  CLOCK_OUT_SUCCESS,
  CLOCK_OUT_FAILURE,
  FETCH_ATTENDANCE_RECORD_REQUEST,
  FETCH_ATTENDANCE_RECORD_SUCCESS,
  FETCH_ATTENDANCE_RECORD_FAILURE,
  FETCH_ATTENDANCE_STATS_REQUEST,
  FETCH_ATTENDANCE_STATS_SUCCESS,
  FETCH_ATTENDANCE_STATS_FAILURE
} from '../types';

// 获取考勤记录
export const fetchAttendanceRecord = (userId) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_ATTENDANCE_RECORD_REQUEST });
    
    // 获取当天的考勤记录
    const todayRecord = await attendanceApi.getTodayRecord(userId);
    
    // 获取本周的考勤记录
    const thisWeekRecords = await attendanceApi.getWeekRecords(userId);
    
    dispatch({ 
      type: FETCH_ATTENDANCE_RECORD_SUCCESS,
      payload: {
        todayRecord,
        thisWeekRecords
      }
    });
    
    return { todayRecord, thisWeekRecords };
  } catch (error) {
    dispatch({ 
      type: FETCH_ATTENDANCE_RECORD_FAILURE,
      payload: error.message || '获取考勤记录失败'
    });
    throw error;
  }
};

// 上班打卡
export const clockIn = (attendanceData) => async (dispatch) => {
  try {
    dispatch({ type: CLOCK_IN_REQUEST });
    
    const result = await attendanceApi.clockIn(attendanceData);
    
    dispatch({ 
      type: CLOCK_IN_SUCCESS,
      payload: result
    });
    
    // 重新获取当天和本周的考勤记录
    dispatch(fetchAttendanceRecord(attendanceData.userId));
    
    return result;
  } catch (error) {
    dispatch({ 
      type: CLOCK_IN_FAILURE,
      payload: error.message || '上班打卡失败'
    });
    throw error;
  }
};

// 下班打卡
export const clockOut = (attendanceData) => async (dispatch) => {
  try {
    dispatch({ type: CLOCK_OUT_REQUEST });
    
    const result = await attendanceApi.clockOut(attendanceData);
    
    dispatch({ 
      type: CLOCK_OUT_SUCCESS,
      payload: result
    });
    
    // 重新获取当天和本周的考勤记录
    dispatch(fetchAttendanceRecord(attendanceData.userId));
    
    return result;
  } catch (error) {
    dispatch({ 
      type: CLOCK_OUT_FAILURE,
      payload: error.message || '下班打卡失败'
    });
    throw error;
  }
};

// 获取考勤统计
export const fetchAttendanceStats = (userId, period) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_ATTENDANCE_STATS_REQUEST });
    
    const stats = await attendanceApi.getAttendanceStats(userId, period);
    
    dispatch({ 
      type: FETCH_ATTENDANCE_STATS_SUCCESS,
      payload: stats
    });
    
    return stats;
  } catch (error) {
    dispatch({ 
      type: FETCH_ATTENDANCE_STATS_FAILURE,
      payload: error.message || '获取考勤统计失败'
    });
    throw error;
  }
};

// 请假申请
export const applyLeave = (leaveData) => async (dispatch) => {
  try {
    dispatch({ type: ATTENDANCE_REQUEST });
    
    const result = await attendanceApi.applyLeave(leaveData);
    
    dispatch({ 
      type: ATTENDANCE_SUCCESS,
      payload: result
    });
    
    return result;
  } catch (error) {
    dispatch({ 
      type: ATTENDANCE_FAILURE,
      payload: error.message || '请假申请失败'
    });
    throw error;
  }
};

// 加班申请
export const applyOvertime = (overtimeData) => async (dispatch) => {
  try {
    dispatch({ type: ATTENDANCE_REQUEST });
    
    const result = await attendanceApi.applyOvertime(overtimeData);
    
    dispatch({ 
      type: ATTENDANCE_SUCCESS,
      payload: result
    });
    
    return result;
  } catch (error) {
    dispatch({ 
      type: ATTENDANCE_FAILURE,
      payload: error.message || '加班申请失败'
    });
    throw error;
  }
};

// 外勤申请
export const applyOutwork = (outworkData) => async (dispatch) => {
  try {
    dispatch({ type: ATTENDANCE_REQUEST });
    
    const result = await attendanceApi.applyOutwork(outworkData);
    
    dispatch({ 
      type: ATTENDANCE_SUCCESS,
      payload: result
    });
    
    return result;
  } catch (error) {
    dispatch({ 
      type: ATTENDANCE_FAILURE,
      payload: error.message || '外勤申请失败'
    });
    throw error;
  }
}; 