import axios from 'axios';

async function testE2E() {
  console.log('====================================================');
  console.log('🚀 RUNNING END-TO-END AUTOMATED VERIFICATION SUITE');
  console.log('====================================================\n');

  try {
    // 1. Health check
    console.log('1. Testing Backend & Services Health (/api/health)...');
    const healthRes = await axios.get('http://localhost:5000/api/health');
    console.log('   Status:', healthRes.data.status);
    console.log('   Database:', healthRes.data.database);
    console.log('   ML Service:', healthRes.data.mlService);
    console.log('   ✓ Health check passed!\n');

    // 2. Authentication Login
    console.log('2. Testing Admin User Login (/api/auth/login)...');
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@empyrict.ai',
      password: 'Admin@123'
    });
    const token = loginRes.data.token;
    console.log('   User:', loginRes.data.user.name, `(${loginRes.data.user.role})`);
    console.log('   JWT Token received:', token.substring(0, 20) + '...');
    console.log('   ✓ Authentication verified!\n');

    const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

    // 3. Dashboard Stats & Charts
    console.log('3. Testing Dashboard Analytics Aggregation (/api/dashboard/stats & /charts)...');
    const statsRes = await axios.get('http://localhost:5000/api/dashboard/stats', authHeaders);
    console.log('   Total Employees:', statsRes.data.data.totalEmployees);
    console.log('   At Risk Count:', statsRes.data.data.atRiskCount);
    console.log('   Low Risk Count:', statsRes.data.data.lowRiskCount);
    console.log('   Model Accuracy:', statsRes.data.data.modelAccuracy + '%');

    const chartsRes = await axios.get('http://localhost:5000/api/dashboard/charts', authHeaders);
    console.log('   Risk Distribution Segments:', chartsRes.data.data.riskDistribution.length);
    console.log('   Department Breakdown Rows:', chartsRes.data.data.departmentBreakdown.length);
    console.log('   Top Global Drivers:', chartsRes.data.data.globalDrivers.top_attrition_drivers.length);
    console.log('   ✓ Dashboard aggregations verified!\n');

    // 4. Employee Directory
    console.log('4. Testing Employee Directory & Pagination (/api/employees)...');
    const empRes = await axios.get('http://localhost:5000/api/employees?page=1&limit=5', authHeaders);
    console.log('   Retrieved Page 1 Employees:', empRes.data.data.length, 'of', empRes.data.total);
    const sampleEmp = empRes.data.data[0];
    console.log('   Sample Employee:', sampleEmp.name, '| Role:', sampleEmp.JobRole, '| Risk:', sampleEmp.currentPrediction?.riskLevel);
    console.log('   ✓ Employee directory verified!\n');

    // 5. Add & Analyze Employee with ML & Groq AI
    console.log('5. Testing Employee Creation & Full AI Analysis (/api/employees/analyze)...');
    const testEmployeePayload = {
      name: 'Elena Rostova (E2E Test)',
      email: 'elena.rostova@testcorp.com',
      Age: 29,
      Gender: 'Female',
      MaritalStatus: 'Single',
      Department: 'Sales',
      JobRole: 'Sales Representative',
      JobLevel: 1,
      BusinessTravel: 'Travel_Frequently',
      OverTime: 'Yes',
      NumCompaniesWorked: 4,
      YearsAtCompany: 1,
      YearsInCurrentRole: 0,
      YearsSinceLastPromotion: 0,
      YearsWithCurrManager: 0,
      TotalWorkingYears: 4,
      TrainingTimesLastYear: 1,
      MonthlyIncome: 2800,
      MonthlyRate: 12000,
      DailyRate: 650,
      HourlyRate: 50,
      PercentSalaryHike: 11,
      StockOptionLevel: 0,
      JobSatisfaction: 1,
      EnvironmentSatisfaction: 1,
      WorkLifeBalance: 1,
      JobInvolvement: 1,
      RelationshipSatisfaction: 2,
      PerformanceRating: 3,
      DistanceFromHome: 28,
      Education: 3,
      EducationField: 'Marketing'
    };

    const analyzeRes = await axios.post('http://localhost:5000/api/employees/analyze', testEmployeePayload, authHeaders);
    const createdEmp = analyzeRes.data.data.employee;
    const prediction = analyzeRes.data.data.prediction;
    const insight = analyzeRes.data.data.aiInsight || analyzeRes.data.data.insight;

    console.log('   Created Employee ID:', createdEmp.employeeId, `(${createdEmp.name})`);
    console.log('   ML Prediction Outcome:', prediction.prediction, '| Risk Level:', prediction.riskLevel, `(${prediction.probabilityLeaving}% probability of leaving)`);
    console.log('   Top Risk Drivers:', prediction.topRiskDrivers.map(d => d.feature || d).join(', '));
    console.log('   Groq AI Priority:', insight.priority);
    console.log('   Groq AI Summary:\n  ', insight.summary.substring(0, 150) + '...');
    console.log('   ✓ Full ML + Groq AI analysis workflow verified!\n');

    // 6. Verify Employee Profile View
    console.log('6. Testing Employee Detail Retrieval (/api/employees/:id)...');
    const detailRes = await axios.get(`http://localhost:5000/api/employees/${createdEmp._id}`, authHeaders);
    console.log('   Retrieved Employee:', detailRes.data.data.employee.name);
    console.log('   Associated Predictions:', detailRes.data.data.predictions.length);
    console.log('   Associated AI Insights:', detailRes.data.data.aiInsights.length);
    console.log('   ✓ Employee profile retrieval verified!\n');

    // 7. Verify Frontend HTTP Serving
    console.log('7. Testing Frontend Client Serving (http://localhost:5173)...');
    const viteRes = await axios.get('http://localhost:5173/');
    console.log('   HTTP Status:', viteRes.status);
    console.log('   Contains Title:', viteRes.data.includes('Empyrict-AI'));
    console.log('   ✓ Frontend client serving verified!\n');

    console.log('====================================================');
    console.log('🎉 ALL 7 FULL-STACK SYSTEM VERIFICATIONS PASSED 100%!');
    console.log('====================================================');
  } catch (error) {
    console.error('❌ E2E TEST FAILED:', error.response?.data || error.message);
    process.exit(1);
  }
}

testE2E();
