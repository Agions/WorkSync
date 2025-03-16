import { getUsers } from './userApi';
import { getWorkTasks } from './workApi';
import dayjs from 'dayjs';

// 生成薪资记录
export const generateSalaryRecords = async (userId = null) => {
  try {
    let users = await getUsers();
    
    if (userId) {
      users = users.filter(user => user.id === userId);
    }
    
    // 获取所有任务
    const allTasks = await getWorkTasks();
    
    const months = ['2023-01', '2023-02', '2023-03', '2023-04', '2023-05', '2023-06'];
    
    return users.flatMap(user => {
      return months.map(month => {
        // 获取该用户当月的任务
        const userTasks = allTasks.filter(task => 
          task.userId === user.id && 
          task.startDate.startsWith(month)
        );
        
        // 计算工时和薪资
        const totalHours = userTasks.reduce((sum, task) => 
          sum + (task.completed ? task.actualHours : 0), 0);
          
        const overtimeHours = userTasks
          .filter(task => task.taskType === 'overtime')
          .reduce((sum, task) => sum + (task.completed ? task.actualHours : 0), 0);
        
        const baseSalary = user.baseSalary;
        const overtimePay = overtimeHours * user.hourlyRate * 1.5;
        const totalSalary = baseSalary + overtimePay;
        
        return {
          id: `${user.id}-${month}`,
          userId: user.id,
          userName: user.name,
          month,
          regularHours: totalHours - overtimeHours,
          overtimeHours,
          baseSalary,
          overtimePay,
          totalSalary,
          paid: months.indexOf(month) < months.length - 1, // 最近一个月未支付
          payDate: months.indexOf(month) < months.length - 1 ? 
            `${month}-25T10:00:00Z` : null
        };
      });
    });
  } catch (error) {
    console.error('生成薪资记录失败:', error);
    throw error;
  }
};

// 获取用户的薪资记录
export const getUserSalaryRecords = async (userId) => {
  try {
    const allRecords = await generateSalaryRecords();
    return allRecords.filter(record => record.userId === userId);
  } catch (error) {
    console.error('获取用户薪资记录失败:', error);
    throw error;
  }
};

// 获取当月薪资
export const getCurrentMonthSalary = async (userId) => {
  try {
    const currentMonth = dayjs().format('YYYY-MM');
    const records = await getUserSalaryRecords(userId);
    return records.find(record => record.month === currentMonth) || null;
  } catch (error) {
    console.error('获取当月薪资失败:', error);
    throw error;
  }
};

// 计算年度薪资总额
export const calculateYearlySalary = async (userId, year = '2023') => {
  try {
    const records = await getUserSalaryRecords(userId);
    const yearRecords = records.filter(record => record.month.startsWith(year));
    
    return {
      year,
      totalBaseSalary: yearRecords.reduce((sum, record) => sum + record.baseSalary, 0),
      totalOvertimePay: yearRecords.reduce((sum, record) => sum + record.overtimePay, 0),
      totalSalary: yearRecords.reduce((sum, record) => sum + record.totalSalary, 0),
      monthlySalaries: yearRecords
    };
  } catch (error) {
    console.error('计算年度薪资失败:', error);
    throw error;
  }
}; 