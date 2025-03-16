import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Share
} from 'react-native';
import { useSelector } from 'react-redux';
import { Icon } from '../../utils/IconFont';
import dayjs from 'dayjs';

const SalaryDetailScreen = ({ route }) => {
  const { salaryId } = route.params;
  const { salaries, loading, error } = useSelector(state => state.salary);
  
  const [salary, setSalary] = useState(null);
  
  useEffect(() => {
    const salaryData = salaries.find(item => item.id === salaryId);
    if (salaryData) {
      setSalary(salaryData);
    }
  }, [salaryId, salaries]);
  
  // 分享薪资详情
  const handleShare = async () => {
    try {
      await Share.share({
        message: `${salary.month}工资条\n基本工资: ¥${salary.baseSalary.toFixed(2)}\n加班工资: ¥${salary.overtimePay.toFixed(2)}\n总计: ¥${salary.totalSalary.toFixed(2)}`,
        title: `${salary.month}工资条`
      });
    } catch (error) {
      console.error('分享失败:', error.message);
    }
  };
  
  if (loading || !salary) {
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
      {/* 薪资标题卡片 */}
      <View style={styles.headerCard}>
        <Text style={styles.monthTitle}>{salary.month} 工资条</Text>
        <View style={styles.headerRow}>
          <View style={[styles.statusBadge, salary.paid ? styles.paidBadge : styles.unpaidBadge]}>
            <Text style={[styles.statusText, salary.paid ? styles.paidText : styles.unpaidText]}>
              {salary.paid ? '已发放' : '待发放'}
            </Text>
          </View>
          {salary.paid && (
            <Text style={styles.payDate}>
              发放日期: {dayjs(salary.payDate).format('YYYY-MM-DD')}
            </Text>
          )}
        </View>
        <Text style={styles.totalAmount}>¥ {salary.totalSalary.toFixed(2)}</Text>
      </View>
      
      {/* 薪资详情卡片 */}
      <View style={styles.detailCard}>
        <Text style={styles.cardTitle}>薪资详情</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>基本工资</Text>
          <Text style={styles.detailValue}>¥ {salary.baseSalary.toFixed(2)}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>加班工资</Text>
          <Text style={styles.detailValue}>¥ {salary.overtimePay.toFixed(2)}</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>总计</Text>
          <Text style={styles.totalValue}>¥ {salary.totalSalary.toFixed(2)}</Text>
        </View>
      </View>
      
      {/* 工时统计卡片 */}
      <View style={styles.detailCard}>
        <Text style={styles.cardTitle}>工时统计</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>常规工时</Text>
          <Text style={styles.detailValue}>{salary.regularHours} 小时</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>加班工时</Text>
          <Text style={styles.detailValue}>{salary.overtimeHours} 小时</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>总工时</Text>
          <Text style={styles.totalValue}>{salary.regularHours + salary.overtimeHours} 小时</Text>
        </View>
      </View>
      
      {/* 个人信息卡片 */}
      <View style={styles.detailCard}>
        <Text style={styles.cardTitle}>个人信息</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>姓名</Text>
          <Text style={styles.detailValue}>{salary.userName}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>职位</Text>
          <Text style={styles.detailValue}>开发工程师</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>基本时薪</Text>
          <Text style={styles.detailValue}>¥ 25.00/小时</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>加班时薪</Text>
          <Text style={styles.detailValue}>¥ 37.50/小时</Text>
        </View>
      </View>
      
      {/* 操作按钮 */}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.shareButton]}
          onPress={handleShare}
        >
          <Icon name="share" size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>分享工资条</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionButton, styles.downloadButton]}>
          <Icon name="download" size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>下载工资条</Text>
        </TouchableOpacity>
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
  headerCard: {
    backgroundColor: '#2E7DF7',
    padding: 20,
    alignItems: 'center',
  },
  monthTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  paidBadge: {
    backgroundColor: 'rgba(232, 245, 233, 0.9)',
  },
  unpaidBadge: {
    backgroundColor: 'rgba(255, 248, 225, 0.9)',
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
  payDate: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.9,
  },
  totalAmount: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  detailCard: {
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666666',
  },
  detailValue: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7DF7',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 12,
    marginTop: 0,
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 12,
    borderRadius: 5,
    marginHorizontal: 6,
  },
  shareButton: {
    backgroundColor: '#4CAF50',
  },
  downloadButton: {
    backgroundColor: '#607D8B',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default SalaryDetailScreen; 