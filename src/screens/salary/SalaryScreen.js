import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { listSalaries } from '../../redux/actions/salaryActions';
import dayjs from 'dayjs';
import { Icon } from '../../utils/IconFont';

const SalaryScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector(state => state.user);
  const { salaries, loading, error } = useSelector(state => state.salary);
  
  const [selectedYear, setSelectedYear] = useState('2023');
  const years = ['2023', '2022', '2021'];
  
  useEffect(() => {
    if (userInfo && userInfo.id) {
      dispatch(listSalaries(userInfo.id));
    }
  }, [dispatch, userInfo]);
  
  // 查看薪资详情
  const handleViewSalaryDetails = (salary) => {
    navigation.navigate('SalaryDetail', { salaryId: salary.id });
  };
  
  // 过滤薪资记录
  const filteredSalaries = salaries.filter(
    salary => salary.month.startsWith(selectedYear)
  );
  
  // 根据支付状态和日期进行排序
  const sortedSalaries = [...filteredSalaries].sort((a, b) => {
    if (a.paid !== b.paid) {
      return a.paid ? 1 : -1; // 未支付的在前面
    }
    return new Date(b.month) - new Date(a.month); // 按日期降序
  });
  
  // 计算年度总收入
  const yearlyTotal = filteredSalaries.reduce(
    (total, salary) => total + salary.totalSalary, 
    0
  );
  
  const renderSalaryItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.salaryItem}
      onPress={() => handleViewSalaryDetails(item)}
    >
      <View style={styles.salaryHeader}>
        <View style={styles.monthContainer}>
          <Icon name="calendar" size={18} color="#666" style={styles.monthIcon} />
          <Text style={styles.month}>{item.month}</Text>
        </View>
        <View style={[styles.statusBadge, item.paid ? styles.paidBadge : styles.unpaidBadge]}>
          <Text style={[styles.statusText, item.paid ? styles.paidText : styles.unpaidText]}>
            {item.paid ? '已发放' : '待发放'}
          </Text>
        </View>
      </View>
      
      <View style={styles.salaryDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>基本工资:</Text>
          <Text style={styles.detailValue}>¥ {item.baseSalary.toFixed(2)}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>加班工资:</Text>
          <Text style={styles.detailValue}>¥ {item.overtimePay.toFixed(2)}</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>总计:</Text>
          <Text style={styles.totalValue}>¥ {item.totalSalary.toFixed(2)}</Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <View style={styles.hoursContainer}>
          <Text style={styles.hoursText}>常规工时: {item.regularHours} 小时</Text>
          <Text style={styles.hoursText}>加班工时: {item.overtimeHours} 小时</Text>
        </View>
        
        <View style={styles.viewDetail}>
          <Text style={styles.viewDetailText}>查看详情</Text>
          <Icon name="arrow-right" size={16} color="#2E7DF7" />
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
      {/* 年度选择器 */}
      <View style={styles.yearSelector}>
        {years.map(year => (
          <TouchableOpacity
            key={year}
            style={[
              styles.yearButton,
              selectedYear === year && styles.selectedYearButton
            ]}
            onPress={() => setSelectedYear(year)}
          >
            <Text style={[
              styles.yearText,
              selectedYear === year && styles.selectedYearText
            ]}>
              {year}年
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* 年度统计卡片 */}
      <View style={styles.totalCard}>
        <Text style={styles.totalCardTitle}>{selectedYear}年总收入</Text>
        <Text style={styles.totalCardValue}>¥ {yearlyTotal.toFixed(2)}</Text>
      </View>
      
      {/* 薪资历史列表 */}
      <FlatList
        data={sortedSalaries}
        renderItem={renderSalaryItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>没有找到薪资记录</Text>
        }
      />
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
  yearSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  yearButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 8,
    backgroundColor: '#F5F5F5',
  },
  selectedYearButton: {
    backgroundColor: '#2E7DF7',
  },
  yearText: {
    fontSize: 14,
    color: '#666666',
  },
  selectedYearText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  totalCard: {
    backgroundColor: '#2E7DF7',
    padding: 20,
    alignItems: 'center',
  },
  totalCardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    opacity: 0.9,
    marginBottom: 8,
  },
  totalCardValue: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 12,
  },
  salaryItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  salaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  monthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthIcon: {
    marginRight: 8,
  },
  month: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  paidBadge: {
    backgroundColor: '#E8F5E9',
  },
  unpaidBadge: {
    backgroundColor: '#FFF8E1',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  paidText: {
    color: '#388E3C',
  },
  unpaidText: {
    color: '#FFA000',
  },
  salaryDetails: {
    padding: 16,
    backgroundColor: '#FAFAFA',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666666',
  },
  detailValue: {
    fontSize: 14,
    color: '#333333',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7DF7',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  hoursContainer: {
    flexDirection: 'row',
  },
  hoursText: {
    fontSize: 12,
    color: '#666666',
    marginRight: 10,
  },
  viewDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetailText: {
    fontSize: 12,
    color: '#2E7DF7',
    marginRight: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999999',
    padding: 30,
    fontSize: 16,
  },
});

export default SalaryScreen; 