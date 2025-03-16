import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { 
  clockIn, 
  clockOut, 
  fetchAttendanceRecord 
} from '../../redux/actions/attendanceActions';
import { Icon } from '../../utils/IconFont';
import moment from 'moment';
import 'moment/locale/zh-cn';

// 获取屏幕宽度
const { width } = Dimensions.get('window');

const ClockInScreen = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);
  const { 
    todayRecord, 
    thisWeekRecords, 
    loading, 
    error 
  } = useSelector(state => state.attendance);
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState(null);
  
  // 初始化和定时更新当前时间
  useEffect(() => {
    // 加载当天打卡记录
    dispatch(fetchAttendanceRecord(user?.id));
    
    // 设置定时器更新当前时间
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    // 模拟获取位置信息
    setLocation({
      latitude: 31.230416,
      longitude: 121.473701,
      address: '上海市黄浦区人民大道100号',
      inRange: true
    });
    
    // 清理定时器
    return () => clearInterval(timer);
  }, [dispatch, user]);
  
  // 打卡操作
  const handleClockIn = () => {
    if (!location) {
      Alert.alert('错误', '无法获取位置信息，请检查定位权限');
      return;
    }
    
    if (!location.inRange) {
      Alert.alert(
        '不在打卡范围',
        '您当前不在公司打卡范围内，是否仍要打卡？',
        [
          { text: '取消', style: 'cancel' },
          { text: '确认打卡', onPress: () => performClockIn() }
        ]
      );
      return;
    }
    
    performClockIn();
  };
  
  // 执行打卡
  const performClockIn = () => {
    const attendanceData = {
      userId: user.id,
      time: new Date().toISOString(),
      type: todayRecord?.clockInTime ? 'clockOut' : 'clockIn',
      location: location.address,
      coordinates: {
        latitude: location.latitude,
        longitude: location.longitude
      }
    };
    
    if (todayRecord?.clockInTime && !todayRecord?.clockOutTime) {
      dispatch(clockOut(attendanceData));
    } else {
      dispatch(clockIn(attendanceData));
    }
  };
  
  // 格式化时间显示
  const formatTime = (date) => {
    return moment(date).format('HH:mm:ss');
  };
  
  const formatDate = (date) => {
    moment.locale('zh-cn');
    return moment(date).format('YYYY年MM月DD日 dddd');
  };
  
  // 计算已工作时间
  const calculateWorkedHours = () => {
    if (!todayRecord?.clockInTime) {
      return '-- : -- : --';
    }
    
    const startTime = new Date(todayRecord.clockInTime);
    const endTime = todayRecord.clockOutTime 
      ? new Date(todayRecord.clockOutTime) 
      : new Date();
    
    const diffMs = endTime - startTime;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000);
    
    return `${String(diffHrs).padStart(2, '0')} : ${String(diffMins).padStart(2, '0')} : ${String(diffSecs).padStart(2, '0')}`;
  };
  
  // 渲染打卡状态
  const renderClockStatus = () => {
    if (todayRecord?.clockInTime && todayRecord?.clockOutTime) {
      return (
        <View style={styles.statusContainer}>
          <Icon name="check-circle" size={24} color="#4CAF50" />
          <Text style={styles.statusText}>今日打卡已完成</Text>
        </View>
      );
    }
    
    if (todayRecord?.clockInTime) {
      return (
        <View style={styles.statusContainer}>
          <Icon name="clock" size={24} color="#FFC107" />
          <Text style={styles.statusText}>已上班，待下班打卡</Text>
        </View>
      );
    }
    
    return (
      <View style={styles.statusContainer}>
        <Icon name="warning" size={24} color="#F44336" />
        <Text style={styles.statusText}>今日未打卡</Text>
      </View>
    );
  };
  
  // 渲染本周打卡记录
  const renderWeekRecords = () => {
    if (!thisWeekRecords || thisWeekRecords.length === 0) {
      return (
        <View style={styles.emptyRecords}>
          <Text style={styles.emptyText}>本周暂无打卡记录</Text>
        </View>
      );
    }
    
    return thisWeekRecords.map((record, index) => (
      <View key={index} style={styles.recordItem}>
        <View style={styles.recordDate}>
          <Text style={styles.recordDay}>
            {moment(record.date).format('DD')}
          </Text>
          <Text style={styles.recordWeekday}>
            {moment(record.date).format('ddd')}
          </Text>
        </View>
        
        <View style={styles.recordTimes}>
          <View style={styles.timeItem}>
            <Text style={styles.timeLabel}>上班</Text>
            <Text style={styles.timeValue}>
              {record.clockInTime 
                ? moment(record.clockInTime).format('HH:mm:ss') 
                : '--:--:--'}
            </Text>
          </View>
          
          <View style={styles.timeSeparator} />
          
          <View style={styles.timeItem}>
            <Text style={styles.timeLabel}>下班</Text>
            <Text style={styles.timeValue}>
              {record.clockOutTime 
                ? moment(record.clockOutTime).format('HH:mm:ss') 
                : '--:--:--'}
            </Text>
          </View>
        </View>
        
        <View style={styles.recordStatus}>
          {record.clockInTime && record.clockOutTime ? (
            <Text style={[styles.statusBadge, styles.completedBadge]}>
              已完成
            </Text>
          ) : record.clockInTime ? (
            <Text style={[styles.statusBadge, styles.partialBadge]}>
              待下班
            </Text>
          ) : (
            <Text style={[styles.statusBadge, styles.missingBadge]}>
              缺卡
            </Text>
          )}
        </View>
      </View>
    ));
  };
  
  if (loading && !todayRecord) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7DF7" />
        <Text style={styles.loadingText}>加载中...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* 当前时间和日期 */}
        <View style={styles.timeContainer}>
          <Text style={styles.currentTime}>
            {formatTime(currentTime)}
          </Text>
          <Text style={styles.currentDate}>
            {formatDate(currentTime)}
          </Text>
          
          {/* 地理位置 */}
          <View style={styles.locationContainer}>
            <Icon name="location" size={16} color="#666666" />
            <Text style={styles.locationText}>
              {location?.address || '获取位置中...'}
            </Text>
            <View style={[
              styles.locationStatus,
              { backgroundColor: location?.inRange ? '#4CAF50' : '#F44336' }
            ]} />
          </View>
        </View>
        
        {/* 打卡状态 */}
        <View style={styles.clockStatusCard}>
          {renderClockStatus()}
          
          <View style={styles.timeRecordContainer}>
            <View style={styles.timeRecord}>
              <Text style={styles.timeRecordLabel}>上班时间</Text>
              <Text style={styles.timeRecordValue}>
                {todayRecord?.clockInTime 
                  ? formatTime(todayRecord.clockInTime) 
                  : '--:--:--'}
              </Text>
            </View>
            
            <View style={styles.timeRecordSeparator} />
            
            <View style={styles.timeRecord}>
              <Text style={styles.timeRecordLabel}>下班时间</Text>
              <Text style={styles.timeRecordValue}>
                {todayRecord?.clockOutTime 
                  ? formatTime(todayRecord.clockOutTime) 
                  : '--:--:--'}
              </Text>
            </View>
          </View>
          
          <View style={styles.workedHoursContainer}>
            <Text style={styles.workedHoursLabel}>已工作时长</Text>
            <Text style={styles.workedHoursValue}>
              {calculateWorkedHours()}
            </Text>
          </View>
        </View>
        
        {/* 打卡按钮 */}
        <TouchableOpacity
          style={[
            styles.clockButton,
            todayRecord?.clockInTime && !todayRecord?.clockOutTime
              ? styles.clockOutButton
              : styles.clockInButton,
            (todayRecord?.clockInTime && todayRecord?.clockOutTime) && styles.disabledButton
          ]}
          onPress={handleClockIn}
          disabled={todayRecord?.clockInTime && todayRecord?.clockOutTime}
        >
          <Text style={styles.clockButtonText}>
            {todayRecord?.clockInTime 
              ? (todayRecord?.clockOutTime ? '今日打卡已完成' : '下班打卡') 
              : '上班打卡'}
          </Text>
        </TouchableOpacity>
        
        {/* 本周记录 */}
        <View style={styles.weekRecordsContainer}>
          <Text style={styles.weekRecordsTitle}>本周打卡记录</Text>
          {renderWeekRecords()}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666666',
  },
  timeContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  currentTime: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333333',
  },
  currentDate: {
    fontSize: 16,
    color: '#666666',
    marginTop: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    backgroundColor: '#F5F5F5',
    padding: 8,
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  locationText: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 5,
    marginRight: 5,
  },
  locationStatus: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  clockStatusCard: {
    backgroundColor: '#FFFFFF',
    margin: 15,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333333',
  },
  timeRecordContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 15,
  },
  timeRecord: {
    flex: 1,
    alignItems: 'center',
  },
  timeRecordLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  timeRecordValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  timeRecordSeparator: {
    width: 1,
    height: '100%',
    backgroundColor: '#EEEEEE',
  },
  workedHoursContainer: {
    alignItems: 'center',
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 15,
  },
  workedHoursLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  workedHoursValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7DF7',
  },
  clockButton: {
    margin: 15,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  clockInButton: {
    backgroundColor: '#2E7DF7',
  },
  clockOutButton: {
    backgroundColor: '#F57C00',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  clockButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  weekRecordsContainer: {
    backgroundColor: '#FFFFFF',
    margin: 15,
    borderRadius: 10,
    padding: 15,
    marginBottom: 30,
  },
  weekRecordsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  emptyRecords: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#999999',
    fontSize: 14,
  },
  recordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  recordDate: {
    width: 40,
    alignItems: 'center',
  },
  recordDay: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  recordWeekday: {
    fontSize: 12,
    color: '#666666',
  },
  recordTimes: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 15,
  },
  timeItem: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 12,
    color: '#666666',
  },
  timeValue: {
    fontSize: 14,
    color: '#333333',
    marginTop: 4,
  },
  timeSeparator: {
    width: 1,
    height: '100%',
    backgroundColor: '#EEEEEE',
    marginHorizontal: 10,
  },
  recordStatus: {
    marginLeft: 10,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
    fontSize: 12,
    overflow: 'hidden',
  },
  completedBadge: {
    backgroundColor: '#E8F5E9',
    color: '#4CAF50',
  },
  partialBadge: {
    backgroundColor: '#FFF8E1',
    color: '#FFC107',
  },
  missingBadge: {
    backgroundColor: '#FFEBEE',
    color: '#F44336',
  }
});

export default ClockInScreen; 