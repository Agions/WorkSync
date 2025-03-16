import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { listTasks } from '../../redux/actions/workActions';
import { listSalaries, getYearlySalary } from '../../redux/actions/salaryActions';
import { 
  LineChart, 
  BarChart, 
  PieChart 
} from 'react-native-chart-kit';
import { Icon } from '../../utils/IconFont';
import dayjs from 'dayjs';

const { width } = Dimensions.get('window');

const StatsScreen = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector(state => state.user);
  const { tasks, loading: tasksLoading } = useSelector(state => state.work);
  const { salaries, yearlySalary, loading: salaryLoading } = useSelector(state => state.salary);
  
  const [activeTab, setActiveTab] = useState('workTime'); // 'workTime', 'salary', 'tasks'
  const [timeRange, setTimeRange] = useState('month'); // 'week', 'month', 'year'
  
  useEffect(() => {
    if (userInfo && userInfo.id) {
      dispatch(listTasks(userInfo.id));
      dispatch(listSalaries(userInfo.id));
      dispatch(getYearlySalary(userInfo.id, '2023'));
    }
  }, [dispatch, userInfo]);
  
  // 工时统计数据处理
  const getWorkTimeData = () => {
    if (!tasks.length) return null;
    
    const now = dayjs();
    let filteredTasks;
    let labels;
    
    if (timeRange === 'week') {
      // 本周数据
      filteredTasks = tasks.filter(task => {
        const taskDate = dayjs(task.startDate);
        return now.diff(taskDate, 'day') < 7;
      });
      labels = Array.from({ length: 7 }, (_, i) => 
        now.subtract(i, 'day').format('MM-DD')
      ).reverse();
    } else if (timeRange === 'month') {
      // 本月数据
      filteredTasks = tasks.filter(task => {
        const taskDate = dayjs(task.startDate);
        return now.diff(taskDate, 'month') < 1;
      });
      labels = ['第1周', '第2周', '第3周', '第4周'];
    } else {
      // 年度数据
      filteredTasks = tasks;
      labels = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    }
    
    // 计算常规和加班工时
    const regularHours = [];
    const overtimeHours = [];
    
    if (timeRange === 'week') {
      for (let i = 0; i < 7; i++) {
        const date = now.subtract(6 - i, 'day').format('YYYY-MM-DD');
        
        const dailyTasks = filteredTasks.filter(task => 
          task.startDate === date
        );
        
        const regularHoursValue = dailyTasks
          .filter(task => task.taskType !== 'overtime')
          .reduce((sum, task) => sum + (task.actualHours || 0), 0);
          
        const overtimeHoursValue = dailyTasks
          .filter(task => task.taskType === 'overtime')
          .reduce((sum, task) => sum + (task.actualHours || 0), 0);
          
        regularHours.push(regularHoursValue);
        overtimeHours.push(overtimeHoursValue);
      }
    } else if (timeRange === 'month') {
      // 按周统计
      for (let i = 0; i < 4; i++) {
        const weekStart = now.startOf('month').add(i * 7, 'day').format('YYYY-MM-DD');
        const weekEnd = now.startOf('month').add((i + 1) * 7 - 1, 'day').format('YYYY-MM-DD');
        
        const weekTasks = filteredTasks.filter(task => 
          task.startDate >= weekStart && task.startDate <= weekEnd
        );
        
        const regularHoursValue = weekTasks
          .filter(task => task.taskType !== 'overtime')
          .reduce((sum, task) => sum + (task.actualHours || 0), 0);
          
        const overtimeHoursValue = weekTasks
          .filter(task => task.taskType === 'overtime')
          .reduce((sum, task) => sum + (task.actualHours || 0), 0);
          
        regularHours.push(regularHoursValue);
        overtimeHours.push(overtimeHoursValue);
      }
    } else {
      // 按月统计
      for (let i = 0; i < 12; i++) {
        const monthStart = dayjs().startOf('year').add(i, 'month').format('YYYY-MM');
        
        const monthTasks = filteredTasks.filter(task => 
          task.startDate.startsWith(monthStart)
        );
        
        const regularHoursValue = monthTasks
          .filter(task => task.taskType !== 'overtime')
          .reduce((sum, task) => sum + (task.actualHours || 0), 0);
          
        const overtimeHoursValue = monthTasks
          .filter(task => task.taskType === 'overtime')
          .reduce((sum, task) => sum + (task.actualHours || 0), 0);
          
        regularHours.push(regularHoursValue);
        overtimeHours.push(overtimeHoursValue);
      }
    }
    
    return {
      labels,
      datasets: [
        {
          data: regularHours,
          color: (opacity = 1) => `rgba(46, 125, 247, ${opacity})`,
          strokeWidth: 2
        },
        {
          data: overtimeHours,
          color: (opacity = 1) => `rgba(255, 87, 34, ${opacity})`,
          strokeWidth: 2
        }
      ],
      legend: ['常规工时', '加班工时']
    };
  };
  
  // 薪资统计数据处理
  const getSalaryData = () => {
    if (!salaries.length) return null;
    
    // 按月份整理薪资数据
    const monthlySalaries = salaries.reduce((acc, salary) => {
      acc[salary.month] = {
        baseSalary: salary.baseSalary,
        overtimePay: salary.overtimePay,
        totalSalary: salary.totalSalary
      };
      return acc;
    }, {});
    
    const labels = [];
    const baseSalaries = [];
    const overtimePays = [];
    
    // 取最近6个月的数据
    const recentMonths = Object.keys(monthlySalaries)
      .sort()
      .slice(-6);
      
    recentMonths.forEach(month => {
      labels.push(month.substring(5)); // 只显示月份
      baseSalaries.push(monthlySalaries[month].baseSalary);
      overtimePays.push(monthlySalaries[month].overtimePay);
    });
    
    return {
      labels,
      datasets: [
        {
          data: baseSalaries,
          color: (opacity = 1) => `rgba(46, 125, 247, ${opacity})`,
          strokeWidth: 2
        },
        {
          data: overtimePays,
          color: (opacity = 1) => `rgba(255, 87, 34, ${opacity})`,
          strokeWidth: 2
        }
      ],
      legend: ['基本工资', '加班工资']
    };
  };
  
  // 任务完成情况统计
  const getTaskCompletionData = () => {
    if (!tasks.length) return null;
    
    const completedTasks = tasks.filter(task => task.completed).length;
    const pendingTasks = tasks.filter(task => !task.completed).length;
    
    // 按任务类型统计
    const regularTasks = tasks.filter(task => task.taskType === 'regular').length;
    const urgentTasks = tasks.filter(task => task.taskType === 'urgent').length;
    const overtimeTasks = tasks.filter(task => task.taskType === 'overtime').length;
    
    const taskStatusData = [
      {
        name: '已完成',
        count: completedTasks,
        color: '#4CAF50',
        legendFontColor: '#7F7F7F',
        legendFontSize: 12
      },
      {
        name: '进行中',
        count: pendingTasks,
        color: '#FFA000',
        legendFontColor: '#7F7F7F',
        legendFontSize: 12
      }
    ];
    
    const taskTypeData = [
      {
        name: '常规任务',
        count: regularTasks,
        color: '#2196F3',
        legendFontColor: '#7F7F7F',
        legendFontSize: 12
      },
      {
        name: '紧急任务',
        count: urgentTasks,
        color: '#FF5722',
        legendFontColor: '#7F7F7F',
        legendFontSize: 12
      },
      {
        name: '加班任务',
        count: overtimeTasks,
        color: '#9C27B0',
        legendFontColor: '#7F7F7F',
        legendFontSize: 12
      }
    ];
    
    return {
      taskStatusData,
      taskTypeData
    };
  };
  
  const workTimeData = getWorkTimeData();
  const salaryData = getSalaryData();
  const taskData = getTaskCompletionData();
  
  const chartConfig = {
    backgroundColor: '#FFFFFF',
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffa726'
    }
  };
  
  const renderWorkTimeStats = () => (
    <>
      <View style={styles.chartTitleContainer}>
        <Text style={styles.chartTitle}>工时统计</Text>
        <View style={styles.timeRangeSelector}>
          <TouchableOpacity
            style={[styles.timeRangeButton, timeRange === 'week' && styles.activeTimeRange]}
            onPress={() => setTimeRange('week')}
          >
            <Text style={[styles.timeRangeText, timeRange === 'week' && styles.activeTimeRangeText]}>
              周
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.timeRangeButton, timeRange === 'month' && styles.activeTimeRange]}
            onPress={() => setTimeRange('month')}
          >
            <Text style={[styles.timeRangeText, timeRange === 'month' && styles.activeTimeRangeText]}>
              月
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.timeRangeButton, timeRange === 'year' && styles.activeTimeRange]}
            onPress={() => setTimeRange('year')}
          >
            <Text style={[styles.timeRangeText, timeRange === 'year' && styles.activeTimeRangeText]}>
              年
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {workTimeData ? (
        <LineChart
          data={workTimeData}
          width={width - 32}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>暂无工时数据</Text>
        </View>
      )}
      
      {/* 工时统计卡片 */}
      <View style={styles.statsCardsContainer}>
        <View style={[styles.statsCard, { backgroundColor: '#E3F2FD' }]}>
          <Icon name="time" size={24} color="#1976D2" />
          <Text style={styles.statsCardValue}>
            {workTimeData ? 
              workTimeData.datasets[0].data.reduce((sum, value) => sum + value, 0) : 0}
          </Text>
          <Text style={styles.statsCardLabel}>常规工时</Text>
        </View>
        
        <View style={[styles.statsCard, { backgroundColor: '#FFF3E0' }]}>
          <Icon name="overtime" size={24} color="#E65100" />
          <Text style={styles.statsCardValue}>
            {workTimeData ? 
              workTimeData.datasets[1].data.reduce((sum, value) => sum + value, 0) : 0}
          </Text>
          <Text style={styles.statsCardLabel}>加班工时</Text>
        </View>
        
        <View style={[styles.statsCard, { backgroundColor: '#E8F5E9' }]}>
          <Icon name="chart" size={24} color="#388E3C" />
          <Text style={styles.statsCardValue}>
            {workTimeData ? 
              workTimeData.datasets[0].data.reduce((sum, value) => sum + value, 0) +
              workTimeData.datasets[1].data.reduce((sum, value) => sum + value, 0) : 0}
          </Text>
          <Text style={styles.statsCardLabel}>总工时</Text>
        </View>
      </View>
    </>
  );
  
  const renderSalaryStats = () => (
    <>
      <View style={styles.chartTitleContainer}>
        <Text style={styles.chartTitle}>薪资趋势</Text>
      </View>
      
      {salaryData ? (
        <BarChart
          data={salaryData}
          width={width - 32}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
          verticalLabelRotation={30}
          fromZero
        />
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>暂无薪资数据</Text>
        </View>
      )}
      
      {/* 薪资统计卡片 */}
      <View style={styles.statsCardsContainer}>
        <View style={[styles.statsCard, { backgroundColor: '#E3F2FD' }]}>
          <Icon name="salary" size={24} color="#1976D2" />
          <Text style={styles.statsCardValue}>
            ¥{yearlySalary ? yearlySalary.totalBaseSalary.toFixed(0) : 0}
          </Text>
          <Text style={styles.statsCardLabel}>年度基本工资</Text>
        </View>
        
        <View style={[styles.statsCard, { backgroundColor: '#FFF3E0' }]}>
          <Icon name="overtime" size={24} color="#E65100" />
          <Text style={styles.statsCardValue}>
            ¥{yearlySalary ? yearlySalary.totalOvertimePay.toFixed(0) : 0}
          </Text>
          <Text style={styles.statsCardLabel}>年度加班工资</Text>
        </View>
        
        <View style={[styles.statsCard, { backgroundColor: '#E8F5E9' }]}>
          <Icon name="salary" size={24} color="#388E3C" />
          <Text style={styles.statsCardValue}>
            ¥{yearlySalary ? yearlySalary.totalSalary.toFixed(0) : 0}
          </Text>
          <Text style={styles.statsCardLabel}>年度总收入</Text>
        </View>
      </View>
    </>
  );
  
  const renderTaskStats = () => (
    <>
      <View style={styles.chartTitleContainer}>
        <Text style={styles.chartTitle}>任务统计</Text>
      </View>
      
      {taskData ? (
        <>
          <View style={styles.pieChartContainer}>
            <Text style={styles.pieChartTitle}>任务状态分布</Text>
            <PieChart
              data={taskData.taskStatusData}
              width={width - 32}
              height={200}
              chartConfig={chartConfig}
              accessor="count"
              backgroundColor="transparent"
              paddingLeft="15"
              center={[10, 0]}
              absolute
            />
          </View>
          
          <View style={styles.pieChartContainer}>
            <Text style={styles.pieChartTitle}>任务类型分布</Text>
            <PieChart
              data={taskData.taskTypeData}
              width={width - 32}
              height={200}
              chartConfig={chartConfig}
              accessor="count"
              backgroundColor="transparent"
              paddingLeft="15"
              center={[10, 0]}
              absolute
            />
          </View>
          
          {/* 任务统计卡片 */}
          <View style={styles.statsCardsContainer}>
            <View style={[styles.statsCard, { backgroundColor: '#E3F2FD' }]}>
              <Icon name="task" size={24} color="#1976D2" />
              <Text style={styles.statsCardValue}>
                {tasks.length}
              </Text>
              <Text style={styles.statsCardLabel}>总任务数</Text>
            </View>
            
            <View style={[styles.statsCard, { backgroundColor: '#E8F5E9' }]}>
              <Icon name="completed" size={24} color="#388E3C" />
              <Text style={styles.statsCardValue}>
                {tasks.filter(task => task.completed).length}
              </Text>
              <Text style={styles.statsCardLabel}>已完成</Text>
            </View>
            
            <View style={[styles.statsCard, { backgroundColor: '#FFF8E1' }]}>
              <Icon name="pending" size={24} color="#FFA000" />
              <Text style={styles.statsCardValue}>
                {tasks.filter(task => !task.completed).length}
              </Text>
              <Text style={styles.statsCardLabel}>进行中</Text>
            </View>
          </View>
        </>
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>暂无任务数据</Text>
        </View>
      )}
    </>
  );
  
  if (tasksLoading || salaryLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7DF7" />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {/* 顶部标签导航 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'workTime' && styles.activeTabButton]}
          onPress={() => setActiveTab('workTime')}
        >
          <Icon 
            name="time" 
            size={18} 
            color={activeTab === 'workTime' ? '#2E7DF7' : '#757575'} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'workTime' && styles.activeTabText
          ]}>
            工时
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'salary' && styles.activeTabButton]}
          onPress={() => setActiveTab('salary')}
        >
          <Icon 
            name="salary" 
            size={18} 
            color={activeTab === 'salary' ? '#2E7DF7' : '#757575'} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'salary' && styles.activeTabText
          ]}>
            薪资
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'tasks' && styles.activeTabButton]}
          onPress={() => setActiveTab('tasks')}
        >
          <Icon 
            name="task" 
            size={18} 
            color={activeTab === 'tasks' ? '#2E7DF7' : '#757575'} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'tasks' && styles.activeTabText
          ]}>
            任务
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.chartContainer}>
          {activeTab === 'workTime' && renderWorkTimeStats()}
          {activeTab === 'salary' && renderSalaryStats()}
          {activeTab === 'tasks' && renderTaskStats()}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: '#2E7DF7',
  },
  tabText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#757575',
  },
  activeTabText: {
    color: '#2E7DF7',
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
  },
  chartContainer: {
    padding: 16,
  },
  chartTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  timeRangeSelector: {
    flexDirection: 'row',
  },
  timeRangeButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
    marginLeft: 5,
    backgroundColor: '#F0F0F0',
  },
  activeTimeRange: {
    backgroundColor: '#2E7DF7',
  },
  timeRangeText: {
    fontSize: 12,
    color: '#666666',
  },
  activeTimeRangeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  statsCardsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 24,
  },
  statsCard: {
    flex: 1,
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statsCardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginVertical: 4,
  },
  statsCardLabel: {
    fontSize: 12,
    color: '#666666',
  },
  pieChartContainer: {
    marginVertical: 16,
    alignItems: 'center',
  },
  pieChartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  noDataContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginVertical: 8,
  },
  noDataText: {
    fontSize: 16,
    color: '#999999',
  },
});

export default StatsScreen; 