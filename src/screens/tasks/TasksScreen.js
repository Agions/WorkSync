import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  TextInput
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { listTasks } from '../../redux/actions/workActions';
import dayjs from 'dayjs';

const TasksScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector(state => state.user);
  const { tasks, loading, error } = useSelector(state => state.work);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'completed', 'pending'
  
  useEffect(() => {
    if (userInfo && userInfo.id) {
      dispatch(listTasks(userInfo.id));
    }
  }, [dispatch, userInfo]);
  
  // 过滤和搜索任务
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = 
      filterStatus === 'all' || 
      (filterStatus === 'completed' && task.completed) || 
      (filterStatus === 'pending' && !task.completed);
    
    return matchesSearch && matchesStatus;
  });
  
  // 打开任务详情
  const handleTaskPress = (taskId) => {
    navigation.navigate('TaskDetail', { taskId });
  };
  
  // 创建新任务
  const handleCreateTask = () => {
    navigation.navigate('CreateTask');
  };
  
  const renderTaskItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.taskItem}
      onPress={() => handleTaskPress(item.id)}
    >
      <View style={styles.taskContent}>
        <View style={styles.taskHeader}>
          <Text style={styles.taskTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={[
            styles.taskStatus, 
            item.completed ? styles.completedStatus : styles.pendingStatus
          ]}>
            <Text style={styles.taskStatusText}>
              {item.completed ? '已完成' : '进行中'}
            </Text>
          </View>
        </View>
        
        <Text style={styles.taskDescription} numberOfLines={2}>
          {item.title} - 任务ID: {item.id}
        </Text>
        
        <View style={styles.taskFooter}>
          <Text style={styles.taskDate}>
            开始日期: {item.startDate}
          </Text>
          <Text style={styles.taskHours}>
            已用时: {item.actualHours || 0} / 预估: {item.estimatedHours} 小时
          </Text>
        </View>
        
        <View style={styles.taskTypeContainer}>
          <Text style={[styles.taskType, 
            item.taskType === 'overtime' ? styles.overtimeType : 
            item.taskType === 'urgent' ? styles.urgentType : 
            styles.regularType
          ]}>
            {item.taskType === 'overtime' ? '加班' : 
             item.taskType === 'urgent' ? '紧急' : '常规'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7DF7" />
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>加载失败: {error}</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {/* 搜索和过滤 */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="搜索任务..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      {/* 状态过滤器 */}
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterButton, filterStatus === 'all' && styles.activeFilter]}
          onPress={() => setFilterStatus('all')}
        >
          <Text style={[styles.filterText, filterStatus === 'all' && styles.activeFilterText]}>
            全部
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterButton, filterStatus === 'pending' && styles.activeFilter]}
          onPress={() => setFilterStatus('pending')}
        >
          <Text style={[styles.filterText, filterStatus === 'pending' && styles.activeFilterText]}>
            进行中
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterButton, filterStatus === 'completed' && styles.activeFilter]}
          onPress={() => setFilterStatus('completed')}
        >
          <Text style={[styles.filterText, filterStatus === 'completed' && styles.activeFilterText]}>
            已完成
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* 任务列表 */}
      <FlatList
        data={filteredTasks}
        renderItem={renderTaskItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>没有找到任务</Text>
        }
      />
      
      {/* 新建任务按钮 */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={handleCreateTask}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
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
  searchContainer: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchInput: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#F0F0F0',
  },
  activeFilter: {
    backgroundColor: '#2E7DF7',
  },
  filterText: {
    fontSize: 14,
    color: '#666666',
  },
  activeFilterText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 10,
  },
  taskItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  taskContent: {
    padding: 15,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
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
  taskDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 10,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskDate: {
    fontSize: 12,
    color: '#888888',
  },
  taskHours: {
    fontSize: 12,
    color: '#555555',
    fontWeight: '500',
  },
  taskTypeContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  taskType: {
    fontSize: 11,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    overflow: 'hidden',
  },
  regularType: {
    backgroundColor: '#E3F2FD',
    color: '#1976D2',
  },
  overtimeType: {
    backgroundColor: '#FCE4EC',
    color: '#C2185B',
  },
  urgentType: {
    backgroundColor: '#FFF3E0',
    color: '#E65100',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999999',
    padding: 30,
    fontSize: 16,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2E7DF7',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  addButtonText: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default TasksScreen; 