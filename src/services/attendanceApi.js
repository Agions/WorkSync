import { api } from './api';
import moment from 'moment';

export const attendanceApi = {
  // 获取当天考勤记录
  async getTodayRecord(userId) {
    try {
      // 实际项目中应调用后端API
      // const response = await api.get(`/attendance/today/${userId}`);
      // return response.data;
      
      // 模拟数据
      const now = new Date();
      const isWorkTime = now.getHours() >= 9 && now.getHours() <= 18;
      
      // 模拟不同时间段的打卡状态
      if (now.getHours() < 9) {
        // 早上未打卡
        return {
          id: `${userId}-${moment().format('YYYYMMDD')}`,
          userId,
          date: moment().format('YYYY-MM-DD'),
          clockInTime: null,
          clockOutTime: null,
          status: 'pending'
        };
      } else if (now.getHours() >= 9 && now.getHours() < 18) {
        // 工作时间内，已打上班卡
        return {
          id: `${userId}-${moment().format('YYYYMMDD')}`,
          userId,
          date: moment().format('YYYY-MM-DD'),
          clockInTime: moment().set({hour: 9, minute: Math.floor(Math.random() * 15)}).toISOString(),
          clockOutTime: null,
          status: 'in_progress'
        };
      } else {
        // 工作时间后，已完成打卡
        return {
          id: `${userId}-${moment().format('YYYYMMDD')}`,
          userId,
          date: moment().format('YYYY-MM-DD'),
          clockInTime: moment().set({hour: 9, minute: Math.floor(Math.random() * 15)}).toISOString(),
          clockOutTime: moment().set({hour: 18, minute: Math.floor(Math.random() * 30) + 30}).toISOString(),
          status: 'completed'
        };
      }
    } catch (error) {
      console.error('获取当天考勤记录失败:', error);
      throw error;
    }
  },
  
  // 获取本周考勤记录
  async getWeekRecords(userId) {
    try {
      // 实际项目中应调用后端API
      // const response = await api.get(`/attendance/week/${userId}`);
      // return response.data;
      
      // 模拟数据 - 生成本周的考勤记录
      const records = [];
      const today = moment();
      
      // 从周一开始到今天
      for (let i = 0; i < 7; i++) {
        const date = moment().startOf('week').add(i, 'days');
        
        // 跳过未来的日期
        if (date.isAfter(today)) {
          continue;
        }
        
        // 跳过周末
        if (date.day() === 0 || date.day() === 6) {
          continue;
        }
        
        // 随机生成不同状态的打卡记录
        const status = Math.random();
        let record = {
          id: `${userId}-${date.format('YYYYMMDD')}`,
          userId,
          date: date.format('YYYY-MM-DD'),
          status: 'completed'
        };
        
        if (status < 0.7 || date.isBefore(today, 'day')) {
          // 完整打卡记录 (70%的概率，或者过去的日期)
          record.clockInTime = date.set({hour: 9, minute: Math.floor(Math.random() * 15)}).toISOString();
          record.clockOutTime = date.set({hour: 18, minute: Math.floor(Math.random() * 30) + 30}).toISOString();
          record.status = 'completed';
        } else if (status < 0.9) {
          // 只有上班卡 (20%的概率)
          record.clockInTime = date.set({hour: 9, minute: Math.floor(Math.random() * 15)}).toISOString();
          record.clockOutTime = null;
          record.status = 'in_progress';
        } else {
          // 缺卡 (10%的概率)
          record.clockInTime = null;
          record.clockOutTime = null;
          record.status = 'absent';
        }
        
        records.push(record);
      }
      
      return records;
    } catch (error) {
      console.error('获取本周考勤记录失败:', error);
      throw error;
    }
  },
  
  // 上班打卡
  async clockIn(attendanceData) {
    try {
      // 实际项目中应调用后端API
      // const response = await api.post('/attendance/clock-in', attendanceData);
      // return response.data;
      
      // 模拟数据
      const clockInTime = new Date().toISOString();
      return {
        id: `${attendanceData.userId}-${moment().format('YYYYMMDD')}`,
        userId: attendanceData.userId,
        date: moment().format('YYYY-MM-DD'),
        clockInTime,
        location: attendanceData.location,
        coordinates: attendanceData.coordinates,
        status: 'in_progress',
        time: clockInTime
      };
    } catch (error) {
      console.error('上班打卡失败:', error);
      throw error;
    }
  },
  
  // 下班打卡
  async clockOut(attendanceData) {
    try {
      // 实际项目中应调用后端API
      // const response = await api.post('/attendance/clock-out', attendanceData);
      // return response.data;
      
      // 模拟数据
      const clockOutTime = new Date().toISOString();
      return {
        id: `${attendanceData.userId}-${moment().format('YYYYMMDD')}`,
        userId: attendanceData.userId,
        date: moment().format('YYYY-MM-DD'),
        clockOutTime,
        location: attendanceData.location,
        coordinates: attendanceData.coordinates,
        status: 'completed',
        time: clockOutTime
      };
    } catch (error) {
      console.error('下班打卡失败:', error);
      throw error;
    }
  },
  
  // 获取考勤统计
  async getAttendanceStats(userId, period = 'month') {
    try {
      // 实际项目中应调用后端API
      // const response = await api.get(`/attendance/stats/${userId}?period=${period}`);
      // return response.data;
      
      // 模拟数据
      return {
        period,
        totalDays: 22,
        presentDays: 20,
        lateDays: 2,
        earlyLeaveDays: 1,
        absentDays: 0,
        overtimeDays: 3,
        overtimeHours: 6,
        leaveApplications: [
          {
            id: 'leave-001',
            type: 'annual',
            startDate: '2023-05-15',
            endDate: '2023-05-16',
            status: 'approved'
          }
        ],
        attendanceRate: 0.91 // 91%
      };
    } catch (error) {
      console.error('获取考勤统计失败:', error);
      throw error;
    }
  },
  
  // 请假申请
  async applyLeave(leaveData) {
    try {
      // 实际项目中应调用后端API
      // const response = await api.post('/attendance/leave', leaveData);
      // return response.data;
      
      // 模拟数据
      return {
        id: `leave-${Date.now()}`,
        userId: leaveData.userId,
        type: leaveData.type,
        reason: leaveData.reason,
        startDate: leaveData.startDate,
        endDate: leaveData.endDate,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('请假申请失败:', error);
      throw error;
    }
  },
  
  // 加班申请
  async applyOvertime(overtimeData) {
    try {
      // 实际项目中应调用后端API
      // const response = await api.post('/attendance/overtime', overtimeData);
      // return response.data;
      
      // 模拟数据
      return {
        id: `overtime-${Date.now()}`,
        userId: overtimeData.userId,
        date: overtimeData.date,
        startTime: overtimeData.startTime,
        endTime: overtimeData.endTime,
        hours: overtimeData.hours,
        reason: overtimeData.reason,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('加班申请失败:', error);
      throw error;
    }
  },
  
  // 外勤申请
  async applyOutwork(outworkData) {
    try {
      // 实际项目中应调用后端API
      // const response = await api.post('/attendance/outwork', outworkData);
      // return response.data;
      
      // 模拟数据
      return {
        id: `outwork-${Date.now()}`,
        userId: outworkData.userId,
        date: outworkData.date,
        location: outworkData.location,
        reason: outworkData.reason,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('外勤申请失败:', error);
      throw error;
    }
  }
}; 