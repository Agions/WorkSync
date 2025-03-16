import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Alert
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getTaskDetails, editTask, logWork } from '../../redux/actions/workActions';
import dayjs from 'dayjs';
import { Icon } from '../../utils/IconFont';

const TaskDetailScreen = ({ route, navigation }) => {
  const { taskId } = route.params;
  const dispatch = useDispatch();
  const { task, loading, error } = useSelector(state => state.work);
  
  const [logHours, setLogHours] = useState('');
  const [logNote, setLogNote] = useState('');
  const [showLogForm, setShowLogForm] = useState(false);
  const [workType, setWorkType] = useState('regular');
  
  useEffect(() => {
    dispatch(getTaskDetails(taskId));
  }, [dispatch, taskId]);
  
  // 记录工时
  const handleLogWork = () => {
    if (!logHours || isNaN(parseFloat(logHours)) || parseFloat(logHours) <= 0) {
      Alert.alert('提示', '请输入有效的工时数量');
      return;
    }
    
    dispatch(logWork(taskId, parseFloat(logHours), workType));
    setLogHours('');
    setLogNote('');
    setShowLogForm(false);
    setWorkType('regular');
  };
  
  // 完成任务
  const handleCompleteTask = () => {
    Alert.alert(
      '确认',
      '确定将任务标记为已完成？',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '确认', 
          onPress: () => {
            dispatch(editTask(taskId, { ...task, completed: true }));
          }
        }
      ]
    );
  };
  
  // 重新打开任务
  const handleReopenTask = () => {
    Alert.alert(
      '确认',
      '确定重新打开此任务？',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '确认', 
          onPress: () => {
            dispatch(editTask(taskId, { ...task, completed: false }));
          }
        }
      ]
    );
  };
  
  // 编辑任务
  const handleEditTask = () => {
    navigation.navigate('EditTask', { task });
  };
  
  if (loading || !task) {
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
    <ScrollView style={styles.container}>
      {/* 任务标题和状态 */}
      <View style={styles.header}>
        <Text style={styles.title}>{task.title}</Text>
        <View style={[
          styles.statusBadge,
          task.completed ? styles.completedBadge : styles.pendingBadge
        ]}>
          <Icon 
            name={task.completed ? 'completed' : 'pending'} 
            size={16} 
            color={task.completed ? '#388E3C' : '#FFA000'} 
          />
          <Text style={[
            styles.statusText,
            task.completed ? styles.completedText : styles.pendingText
          ]}>
            {task.completed ? '已完成' : '进行中'}
          </Text>
        </View>
      </View>
      
      {/* 任务详情 */}
      <View style={styles.detailsCard}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Icon name="calendar" size={18} color="#666" style={styles.detailIcon} />
            <Text style={styles.detailLabel}>开始日期:</Text>
            <Text style={styles.detailValue}>{task.startDate}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Icon name="time" size={18} color="#666" style={styles.detailIcon} />
            <Text style={styles.detailLabel}>预估工时:</Text>
            <Text style={styles.detailValue}>{task.estimatedHours} 小时</Text>
          </View>
        </View>
        
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Icon 
              name={task.taskType} 
              size={18} 
              color={
                task.taskType === 'overtime' ? '#C2185B' : 
                task.taskType === 'urgent' ? '#E65100' : '#1976D2'
              } 
              style={styles.detailIcon} 
            />
            <Text style={styles.detailLabel}>任务类型:</Text>
            <Text style={[
              styles.detailValue,
              task.taskType === 'overtime' ? styles.overtimeText : 
              task.taskType === 'urgent' ? styles.urgentText : styles.regularText
            ]}>
              {task.taskType === 'overtime' ? '加班' : 
               task.taskType === 'urgent' ? '紧急' : '常规'}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Icon name="time" size={18} color="#666" style={styles.detailIcon} />
            <Text style={styles.detailLabel}>已用工时:</Text>
            <Text style={styles.detailValue}>{task.actualHours || 0} 小时</Text>
          </View>
        </View>
      </View>
      
      {/* 工时进度 */}
      <View style={styles.progressCard}>
        <Text style={styles.sectionTitle}>工时进度</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${Math.min(100, (task.actualHours / task.estimatedHours) * 100)}%`,
                  backgroundColor: task.completed ? '#4CAF50' : '#2E7DF7'
                }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {task.actualHours || 0} / {task.estimatedHours} 小时
            {task.estimatedHours > 0 && ` (${Math.round((task.actualHours / task.estimatedHours) * 100)}%)`}
          </Text>
        </View>
      </View>
      
      {/* 工时记录表单 */}
      {showLogForm ? (
        <View style={styles.logFormCard}>
          <Text style={styles.sectionTitle}>记录工时</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>工作时间 (小时)</Text>
            <TextInput
              style={styles.textInput}
              value={logHours}
              onChangeText={setLogHours}
              keyboardType="numeric"
              placeholder="输入工作时间"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>备注</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={logNote}
              onChangeText={setLogNote}
              placeholder="添加备注 (可选)"
              multiline
            />
          </View>
          
          <View style={styles.typeSelector}>
            <Text style={styles.inputLabel}>工作类型:</Text>
            <View style={styles.typeButtons}>
              <TouchableOpacity 
                style={[styles.typeButton, workType === 'regular' && styles.activeTypeButton]}
                onPress={() => setWorkType('regular')}
              >
                <Text style={[styles.typeButtonText, workType === 'regular' && styles.activeTypeText]}>常规</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.typeButton, workType === 'overtime' && styles.activeTypeButton]}
                onPress={() => setWorkType('overtime')}
              >
                <Text style={[styles.typeButtonText, workType === 'overtime' && styles.activeTypeText]}>加班</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.typeButton, workType === 'urgent' && styles.activeTypeButton]}
                onPress={() => setWorkType('urgent')}
              >
                <Text style={[styles.typeButtonText, workType === 'urgent' && styles.activeTypeText]}>紧急</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.formButtons}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]}
              onPress={() => setShowLogForm(false)}
            >
              <Text style={styles.cancelButtonText}>取消</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.submitButton]}
              onPress={handleLogWork}
            >
              <Text style={styles.submitButtonText}>提交</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.actionsCard}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.logButton]}
            onPress={() => setShowLogForm(true)}
          >
            <Icon name="time" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>记录工时</Text>
          </TouchableOpacity>
          
          {!task.completed ? (
            <TouchableOpacity 
              style={[styles.actionButton, styles.completeButton]}
              onPress={handleCompleteTask}
            >
              <Icon name="completed" size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>完成任务</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.actionButton, styles.reopenButton]}
              onPress={handleReopenTask}
            >
              <Icon name="pending" size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>重新打开</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]}
            onPress={handleEditTask}
          >
            <Icon name="edit" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>编辑任务</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* 工时历史记录 */}
      <View style={styles.historyCard}>
        <Text style={styles.sectionTitle}>工时记录历史</Text>
        
        {/* 这里可以显示历史记录列表，但示例数据中没有，后续可扩展 */}
        <Text style={styles.emptyText}>暂无工时记录历史</Text>
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
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  completedBadge: {
    backgroundColor: '#E8F5E9',
  },
  pendingBadge: {
    backgroundColor: '#FFF8E1',
  },
  statusText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
  completedText: {
    color: '#388E3C',
  },
  pendingText: {
    color: '#FFA000',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    margin: 12,
    padding: 16,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailIcon: {
    marginRight: 5,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666666',
    marginRight: 5,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  overtimeText: {
    color: '#C2185B',
  },
  urgentText: {
    color: '#E65100',
  },
  regularText: {
    color: '#1976D2',
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    margin: 12,
    padding: 16,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  progressContainer: {
    marginTop: 10,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
  },
  progressText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'right',
  },
  actionsCard: {
    backgroundColor: '#FFFFFF',
    margin: 12,
    padding: 16,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    paddingVertical: 12,
    marginBottom: 10,
  },
  logButton: {
    backgroundColor: '#2E7DF7',
  },
  completeButton: {
    backgroundColor: '#4CAF50',
  },
  reopenButton: {
    backgroundColor: '#FF9800',
  },
  editButton: {
    backgroundColor: '#607D8B',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  logFormCard: {
    backgroundColor: '#FFFFFF',
    margin: 12,
    padding: 16,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555555',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  typeSelector: {
    marginBottom: 16,
  },
  typeButtons: {
    flexDirection: 'row',
    marginTop: 8,
  },
  typeButton: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
  },
  activeTypeButton: {
    backgroundColor: '#2E7DF7',
    borderColor: '#2E7DF7',
  },
  typeButtonText: {
    fontSize: 14,
    color: '#555555',
  },
  activeTypeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  submitButton: {
    backgroundColor: '#2E7DF7',
  },
  cancelButtonText: {
    color: '#555555',
    fontSize: 16,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    margin: 12,
    padding: 16,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999999',
    padding: 20,
    fontSize: 14,
  },
});

export default TaskDetailScreen; 