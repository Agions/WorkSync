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

// 初始状态
const initialState = {
  loading: false,
  error: null,
  todayRecord: null,
  thisWeekRecords: [],
  attendanceStats: null,
  clockInTime: null,
  clockOutTime: null
};

const attendanceReducer = (state = initialState, action) => {
  switch (action.type) {
    // 通用请求开始状态
    case ATTENDANCE_REQUEST:
    case CLOCK_IN_REQUEST:
    case CLOCK_OUT_REQUEST:
    case FETCH_ATTENDANCE_RECORD_REQUEST:
    case FETCH_ATTENDANCE_STATS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    // 打卡成功
    case CLOCK_IN_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        clockInTime: action.payload.time
      };
    
    // 下班打卡成功
    case CLOCK_OUT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        clockOutTime: action.payload.time
      };
    
    // 获取考勤记录成功
    case FETCH_ATTENDANCE_RECORD_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        todayRecord: action.payload.todayRecord,
        thisWeekRecords: action.payload.thisWeekRecords
      };
    
    // 获取考勤统计成功
    case FETCH_ATTENDANCE_STATS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        attendanceStats: action.payload
      };
    
    // 其他请求成功
    case ATTENDANCE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null
      };
    
    // 各种请求失败
    case ATTENDANCE_FAILURE:
    case CLOCK_IN_FAILURE:
    case CLOCK_OUT_FAILURE:
    case FETCH_ATTENDANCE_RECORD_FAILURE:
    case FETCH_ATTENDANCE_STATS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    default:
      return state;
  }
};

export default attendanceReducer; 