import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { listTasks } from '../redux/actions/workActions';
import { getCurrentSalary } from '../redux/actions/salaryActions';
import dayjs from 'dayjs';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector(state => state.user);
  const { tasks, loading: tasksLoading } = useSelector(state => state.work);
  const { currentSalary, loading: salaryLoading } = useSelector(state => state.salary);
  
  const [currentDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [clockedIn, setClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  
  useEffect(() => {
    if (userInfo && userInfo.id) {
      dispatch(listTasks(userInfo.id));
      dispatch(getCurrentSalary(userInfo.id));
    }
  }, [dispatch, userInfo]);
  
  // 今日任务
  const todayTasks = tasks.filter(task => 
    task.userId === userInfo?.id && task.startDate === currentDate
  );
  
  // 进行中的任务
  const inProgressTasks = tasks.filter(task => 
    task.userId === userInfo?.id && !task.completed
  );
  
  // 已完成的任务
  const completedTasks = tasks.filter(task => 
    task.userId === userInfo?.id && task.completed
  );
  
  // 打卡功能
  const handleClockIn = () => {
    if (!clockedIn) {
      setClockInTime(new Date());
      setClockedIn(true);
      // 这里应该调用API记录打卡时间
    } else {
      setClockedIn(false);
      // 这里应该调用API记录下班时间
    }
  };
  
  // 跳转到任务详情
  const handleTaskPress = (taskId) => {
    navigation.navigate('TasksTab', {
      screen: 'TaskDetail',
      params: { taskId }
    });
  };
  
  if (tasksLoading || salaryLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7DF7" />
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      {/* 用户信息与工时卡片 */}
      <View style={styles.headerCard}>
        <Text style={styles.greeting}>你好, {userInfo?.name || '用户'}</Text>
        <Text style={styles.date}>{currentDate}</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{inProgressTasks.length}</Text>
            <Text style={styles.statLabel}>进行中任务</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{completedTasks.length}</Text>
            <Text style={styles.statLabel}>已完成任务</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>
              {completedTasks.reduce((total, task) => total + task.actualHours, 0)}
            </Text>
            <Text style={styles.statLabel}>已记录工时</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={[styles.clockButton, clockedIn && styles.clockOutButton]}
          onPress={handleClockIn}
        >
          <Text style={styles.clockButtonText}>
            {clockedIn ? '下班打卡' : '上班打卡'}
          </Text>
        </TouchableOpacity>
        
        {clockedIn && clockInTime && (
          <Text style={styles.clockInTime}>
            上班时间: {dayjs(clockInTime).format('HH:mm:ss')}
          </Text>
        )}
      </View>
      
      {/* 今日任务 */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>今日任务</Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('TasksTab', { screen: 'Tasks' })}
          >
            <Text style={styles.viewAllText}>查看全部</Text>
          </TouchableOpacity>
        </View>
        
        {todayTasks.length > 0 ? (
          todayTasks.map(task => (
            <TouchableOpacity 
              key={task.id} 
              style={styles.taskItem}
              onPress={() => handleTaskPress(task.id)}
            >
              <View style={styles.taskHeader}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <View style={[
                  styles.taskStatus, 
                  task.completed ? styles.completedStatus : styles.pendingStatus
                ]}>
                  <Text style={styles.taskStatusText}>
                    {task.completed ? '已完成' : '进行中'}
                  </Text>
                </View>
              </View>
              <Text style={styles.taskHours}>
                已用时: {task.actualHours || 0} / 预估: {task.estimatedHours} 小时
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyText}>今天没有安排任务</Text>
        )}
      </View>
      
      {/* 当月薪资 */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>本月薪资</Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('SalaryTab', { screen: 'Salary' })}
          >
            <Text style={styles.viewAllText}>薪资历史</Text>
          </TouchableOpacity>
        </View>
        
        {currentSalary ? (
          <View style={styles.salaryCard}>
            <Text style={styles.salaryTitle}>
              {currentSalary.month} 薪资明细
            </Text>
            <View style={styles.salaryRow}>
              <Text style={styles.salaryLabel}>基本工资:</Text>
              <Text style={styles.salaryValue}>¥ {currentSalary.baseSalary.toFixed(2)}</Text>
            </View>
            <View style={styles.salaryRow}>
              <Text style={styles.salaryLabel}>加班工资:</Text>
              <Text style={styles.salaryValue}>¥ {currentSalary.overtimePay.toFixed(2)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.salaryRow}>
              <Text style={[styles.salaryLabel, styles.totalLabel]}>总计:</Text>
              <Text style={styles.totalValue}>¥ {currentSalary.totalSalary.toFixed(2)}</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.emptyText}>暂无薪资数据</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCard: {
    backgroundColor: '#2E7DF7',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  date: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },
  statBox: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  clockButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  clockOutButton: {
    backgroundColor: '#FF5722',
  },
  clockButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  clockInTime: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 10,
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    margin: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllText: {
    color: '#2E7DF7',
    fontSize: 14,
  },
  taskItem: {
    borderWidth: 1,
    borderColor: '#EEE',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  taskStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  pendingStatus: {
    backgroundColor: '#FFF8E1',
  },
  completedStatus: {
    backgroundColor: '#E8F5E9',
  },
  taskStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  taskHours: {
    fontSize: 14,
    color: '#757575',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    padding: 20,
  },
  salaryCard: {
    padding: 15,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
  },
  salaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  salaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  salaryLabel: {
    fontSize: 14,
    color: '#555',
  },
  salaryValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  totalLabel: {
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7DF7',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEE',
    marginVertical: 10,
  },
});

export default HomeScreen; 