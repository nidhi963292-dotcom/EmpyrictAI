import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  User,
  Briefcase,
  Clock,
  DollarSign,
  HeartHandshake,
  Sparkles,
  ArrowLeft,
  Check,
  AlertCircle,
  Save,
  BrainCircuit
} from 'lucide-react';
import { employeeService } from '../services/employeeService';

export const EmployeeFormPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState('');

  // Form State containing exact 30 model features
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    email: '',
    Age: 32,
    Gender: 'Male',
    MaritalStatus: 'Single',

    Department: 'Sales',
    JobRole: 'Sales Executive',
    JobLevel: 2,
    BusinessTravel: 'Travel_Frequently',
    OverTime: 'Yes',
    NumCompaniesWorked: 3,

    YearsAtCompany: 3,
    YearsInCurrentRole: 2,
    YearsSinceLastPromotion: 1,
    YearsWithCurrManager: 2,
    TotalWorkingYears: 6,
    TrainingTimesLastYear: 2,

    MonthlyIncome: 4500,
    MonthlyRate: 14000,
    DailyRate: 800,
    HourlyRate: 65,
    PercentSalaryHike: 13,
    StockOptionLevel: 0,

    JobSatisfaction: 2,
    EnvironmentSatisfaction: 1,
    WorkLifeBalance: 2,
    JobInvolvement: 2,
    RelationshipSatisfaction: 2,
    PerformanceRating: 3,
    DistanceFromHome: 18,
    Education: 3,
    EducationField: 'Marketing'
  });

  useEffect(() => {
    if (isEdit) {
      const loadEmployee = async () => {
        try {
          setFetching(true);
          const res = await employeeService.getEmployeeById(id);
          if (res.data?.employee) {
            setFormData(res.data.employee);
          }
        } catch (err) {
          setError('Failed to load employee details.');
        } finally {
          setFetching(false);
        }
      };
      loadEmployee();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handlePreset = (preset) => {
    if (preset === 'highRisk') {
      setFormData((prev) => ({
        ...prev,
        name: 'Jordan Miller (High Risk)',
        Age: 28,
        Department: 'Sales',
        JobRole: 'Sales Representative',
        BusinessTravel: 'Travel_Frequently',
        OverTime: 'Yes',
        JobSatisfaction: 1,
        EnvironmentSatisfaction: 1,
        WorkLifeBalance: 1,
        JobInvolvement: 1,
        DistanceFromHome: 25,
        MonthlyIncome: 2600,
        YearsAtCompany: 1,
        YearsInCurrentRole: 0,
        YearsSinceLastPromotion: 0,
        YearsWithCurrManager: 0
      }));
    } else if (preset === 'stable') {
      setFormData((prev) => ({
        ...prev,
        name: 'Alexander Vance (Stable)',
        Age: 45,
        Department: 'Research & Development',
        JobRole: 'Manager',
        BusinessTravel: 'Non-Travel',
        OverTime: 'No',
        JobSatisfaction: 4,
        EnvironmentSatisfaction: 4,
        WorkLifeBalance: 4,
        JobInvolvement: 4,
        DistanceFromHome: 3,
        MonthlyIncome: 14000,
        YearsAtCompany: 12,
        YearsInCurrentRole: 6,
        YearsSinceLastPromotion: 1,
        YearsWithCurrManager: 6,
        StockOptionLevel: 2
      }));
    }
  };

  // Submit and immediately trigger ML + Groq AI pipeline
  const handleAnalyzeSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name) {
      setError('Please provide the employee full name.');
      return;
    }

    setLoading(true);
    try {
      const res = await employeeService.analyzeEmployee(formData);
      const createdId = res.data?.employee?._id;
      if (createdId) {
        navigate(`/employees/${createdId}`);
      } else {
        navigate('/employees');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Analysis failed. Please check form parameters.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Save employee only without full AI analysis
  const handleSaveOnly = async () => {
    setError('');
    if (!formData.name) {
      setError('Please provide the employee full name.');
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await employeeService.updateEmployee(id, formData);
      } else {
        await employeeService.createEmployee(formData);
      }
      navigate('/employees');
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: 'personal', label: '1. Personal Info', icon: User },
    { id: 'employment', label: '2. Role & Department', icon: Briefcase },
    { id: 'tenure', label: '3. Tenure & Experience', icon: Clock },
    { id: 'compensation', label: '4. Compensation', icon: DollarSign },
    { id: 'satisfaction', label: '5. Work Environment', icon: HeartHandshake }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/employees"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {isEdit ? `Edit Employee: ${formData.name}` : 'Add & Evaluate Employee'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Enter 30 workforce metrics to generate ML predictions and Groq AI retention plans.
            </p>
          </div>
        </div>

        {/* Quick Demo Preset Buttons */}
        {!isEdit && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handlePreset('highRisk')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 transition-colors"
            >
              Fill High-Risk Sample
            </button>
            <button
              type="button"
              onClick={() => handlePreset('stable')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
            >
              Fill Stable Sample
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Multi-Section Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Form Container */}
      <form onSubmit={handleAnalyzeSubmit} className="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
        {/* SECTION 1: PERSONAL INFO */}
        {activeTab === 'personal' && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-brand-500/50 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Employee ID
                </label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  placeholder="Auto-generated (e.g. EMP-0016)"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-brand-500/50 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Work Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="sarah.jenkins@empyrict.ai"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-brand-500/50 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Age (18–65) *
                </label>
                <input
                  type="number"
                  name="Age"
                  min="18"
                  max="65"
                  required
                  value={formData.Age}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-brand-500/50 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Gender
                </label>
                <select
                  name="Gender"
                  value={formData.Gender}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-brand-500/50 text-slate-900 dark:text-slate-100"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Marital Status
                </label>
                <select
                  name="MaritalStatus"
                  value={formData.MaritalStatus}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-brand-500/50 text-slate-900 dark:text-slate-100"
                >
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: ROLE & DEPARTMENT */}
        {activeTab === 'employment' && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800">
              Employment & Role Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Department
                </label>
                <select
                  name="Department"
                  value={formData.Department}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-brand-500/50 text-slate-900 dark:text-slate-100"
                >
                  <option value="Research & Development">Research & Development</option>
                  <option value="Sales">Sales</option>
                  <option value="Human Resources">Human Resources</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Job Role
                </label>
                <select
                  name="JobRole"
                  value={formData.JobRole}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-brand-500/50 text-slate-900 dark:text-slate-100"
                >
                  <option value="Sales Executive">Sales Executive</option>
                  <option value="Research Scientist">Research Scientist</option>
                  <option value="Laboratory Technician">Laboratory Technician</option>
                  <option value="Manufacturing Director">Manufacturing Director</option>
                  <option value="Healthcare Representative">Healthcare Representative</option>
                  <option value="Manager">Manager</option>
                  <option value="Sales Representative">Sales Representative</option>
                  <option value="Research Director">Research Director</option>
                  <option value="Human Resources">Human Resources</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Job Level (1–5)
                </label>
                <input
                  type="number"
                  name="JobLevel"
                  min="1"
                  max="5"
                  value={formData.JobLevel}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-brand-500/50 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Business Travel
                </label>
                <select
                  name="BusinessTravel"
                  value={formData.BusinessTravel}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-brand-500/50 text-slate-900 dark:text-slate-100"
                >
                  <option value="Non-Travel">Non-Travel</option>
                  <option value="Travel_Rarely">Travel Rarely</option>
                  <option value="Travel_Frequently">Travel Frequently</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mandatory Overtime
                </label>
                <select
                  name="OverTime"
                  value={formData.OverTime}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-brand-500/50 text-slate-900 dark:text-slate-100"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes (High attrition predictor)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Prior Companies Worked
                </label>
                <input
                  type="number"
                  name="NumCompaniesWorked"
                  min="0"
                  max="15"
                  value={formData.NumCompaniesWorked}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-brand-500/50 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: TENURE */}
        {activeTab === 'tenure' && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800">
              Tenure & Experience History
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Years at Company (0–40)
                </label>
                <input
                  type="number"
                  name="YearsAtCompany"
                  min="0"
                  max="45"
                  value={formData.YearsAtCompany}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-brand-500/50 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Years in Current Role
                </label>
                <input
                  type="number"
                  name="YearsInCurrentRole"
                  min="0"
                  max="30"
                  value={formData.YearsInCurrentRole}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-brand-500/50 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Years Since Last Promotion
                </label>
                <input
                  type="number"
                  name="YearsSinceLastPromotion"
                  min="0"
                  max="20"
                  value={formData.YearsSinceLastPromotion}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-brand-500/50 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Years with Current Manager
                </label>
                <input
                  type="number"
                  name="YearsWithCurrManager"
                  min="0"
                  max="25"
                  value={formData.YearsWithCurrManager}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-brand-500/50 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Total Working Years
                </label>
                <input
                  type="number"
                  name="TotalWorkingYears"
                  min="0"
                  max="50"
                  value={formData.TotalWorkingYears}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-brand-500/50 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Training Sessions Last Year
                </label>
                <input
                  type="number"
                  name="TrainingTimesLastYear"
                  min="0"
                  max="10"
                  value={formData.TrainingTimesLastYear}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-brand-500/50 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: COMPENSATION */}
        {activeTab === 'compensation' && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800">
              Salary & Financial Incentives
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Monthly Income ($USD) *
                </label>
                <input
                  type="number"
                  name="MonthlyIncome"
                  min="1000"
                  max="30000"
                  required
                  value={formData.MonthlyIncome}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-brand-500/50 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Salary Hike Percentage (%)
                </label>
                <input
                  type="number"
                  name="PercentSalaryHike"
                  min="0"
                  max="50"
                  value={formData.PercentSalaryHike}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-brand-500/50 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Stock Option Level (0–3)
                </label>
                <input
                  type="number"
                  name="StockOptionLevel"
                  min="0"
                  max="3"
                  value={formData.StockOptionLevel}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-brand-500/50 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Daily Rate
                </label>
                <input
                  type="number"
                  name="DailyRate"
                  value={formData.DailyRate}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-brand-500/50 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION 5: SATISFACTION & ENVIRONMENT */}
        {activeTab === 'satisfaction' && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800">
              Workplace Satisfaction & Well-Being
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Job Satisfaction (1: Low to 4: Very High)
                </label>
                <select
                  name="JobSatisfaction"
                  value={formData.JobSatisfaction}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-brand-500/50 text-slate-900 dark:text-slate-100"
                >
                  <option value={1}>1 - Low (High Attrition Risk)</option>
                  <option value={2}>2 - Medium</option>
                  <option value={3}>3 - High</option>
                  <option value={4}>4 - Very High (High Retention)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Environment Satisfaction (1–4)
                </label>
                <select
                  name="EnvironmentSatisfaction"
                  value={formData.EnvironmentSatisfaction}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-brand-500/50 text-slate-900 dark:text-slate-100"
                >
                  <option value={1}>1 - Low</option>
                  <option value={2}>2 - Medium</option>
                  <option value={3}>3 - High</option>
                  <option value={4}>4 - Very High</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Work-Life Balance (1–4)
                </label>
                <select
                  name="WorkLifeBalance"
                  value={formData.WorkLifeBalance}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-brand-500/50 text-slate-900 dark:text-slate-100"
                >
                  <option value={1}>1 - Poor</option>
                  <option value={2}>2 - Fair</option>
                  <option value={3}>3 - Good</option>
                  <option value={4}>4 - Best</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Job Involvement (1–4)
                </label>
                <select
                  name="JobInvolvement"
                  value={formData.JobInvolvement}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-brand-500/50 text-slate-900 dark:text-slate-100"
                >
                  <option value={1}>1 - Low</option>
                  <option value={2}>2 - Medium</option>
                  <option value={3}>3 - High</option>
                  <option value={4}>4 - Very High</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Commute Distance From Home (km)
                </label>
                <input
                  type="number"
                  name="DistanceFromHome"
                  min="1"
                  max="50"
                  value={formData.DistanceFromHome}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-brand-500/50 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Performance Rating (3–4)
                </label>
                <select
                  name="PerformanceRating"
                  value={formData.PerformanceRating}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-brand-500/50 text-slate-900 dark:text-slate-100"
                >
                  <option value={3}>3 - Excellent</option>
                  <option value={4}>4 - Outstanding</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleSaveOnly}
            disabled={loading}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Record Only
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Running ML & Groq AI Analysis...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Employee with AI</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
