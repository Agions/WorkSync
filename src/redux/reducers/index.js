import { combineReducers } from 'redux';
import userReducer from './userReducer';
import workReducer from './workReducer';
import salaryReducer from './salaryReducer';
import attendanceReducer from './attendanceReducer';

const rootReducer = combineReducers({
  user: userReducer,
  work: workReducer,
  salary: salaryReducer,
  attendance: attendanceReducer
});

export default rootReducer; 