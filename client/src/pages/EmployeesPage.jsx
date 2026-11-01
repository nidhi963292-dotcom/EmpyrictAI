import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  UserPlus,
  Trash2,
  Edit,
  Eye,
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  FileSpreadsheet,
  UploadCloud,
  CheckCircle2,
  Download,
  Info,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { employeeService } from '../services/employeeService';
import { predictionService } from '../services/predictionService';
import { RiskBadge } from '../components/RiskBadge';
import { TableSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';

export const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [riskLevel, setRiskLevel] = useState('All');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);

  // CSV Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [replaceExisting, setReplaceExisting] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState(null);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await employeeService.getEmployees({
        page,
        limit: 10,
        search,
        department,
        riskLevel
      });
      setEmployees(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('[Fetch Employees Error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [page, department, riskLevel]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchEmployees();
  };

  const handleQuickPredict = async (e, id) => {
    e.stopPropagation();
    try {
      setActionLoading((prev) => ({ ...prev, [id]: true }));
      await predictionService.predictEmployee(id);
      await fetchEmployees();
    } catch (err) {
      alert('Prediction failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await employeeService.deleteEmployee(deleteTarget._id);
      setDeleteTarget(null);
      fetchEmployees();
    } catch (err) {
      alert('Failed to delete employee: ' + err.message);
    }
  };

  const handleClearAllConfirm = async () => {
    try {
      await employeeService.clearAll();
      setShowClearModal(false);
      setUploadFeedback({
        type: 'success',
        message: 'Successfully cleared all employee records.'
      });
      fetchEmployees();
    } catch (err) {
      alert('Failed to clear employees: ' + err.message);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadFeedback(null);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadFeedback({ type: 'error', message: 'Please select a .csv file to upload.' });
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('replaceExisting', replaceExisting);

    try {
      setUploading(true);
      setUploadFeedback(null);
      const res = await employeeService.uploadCSV(formData);
      setUploadFeedback({
        type: 'success',
        message: res.message || `Successfully imported ${res.count} employees with ML analysis!`
      });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setTimeout(() => {
        setShowUploadModal(false);
        fetchEmployees();
      }, 1500);
    } catch (err) {
      setUploadFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to parse CSV. Verify column headers.'
      });
    } finally {
      setUploading(false);
    }
  };

  // Download sample 50-employee CSV file
  const handleDownloadSampleCSV = () => {
    const link = document.createElement('a');
    link.href = '/sample_50_employees.csv';
    link.download = 'sample_50_employees.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Employee Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage employee records, upload IBM HR CSV datasets, and compute ML attrition risks.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          {/* Clear All Data Button */}
          {employees.length > 0 && (
            <button
              onClick={() => setShowClearModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All Data
            </button>
          )}

          {/* Upload CSV Dataset CTA */}
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-sm transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" /> Upload CSV Dataset
          </button>

          {/* Add Single Employee */}
          <Link
            to="/employees/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/20 transition-all"
          >
            <UserPlus className="w-4 h-4" /> Add Employee
          </Link>
        </div>
      </div>

      {/* Global Feedback Banner */}
      {uploadFeedback && (
        <div
          className={`flex items-center gap-2 p-4 rounded-xl text-xs font-medium border ${
            uploadFeedback.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
              : 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
          }`}
        >
          {uploadFeedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{uploadFeedback.message}</span>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="glass-card rounded-2xl p-4 flex flex-col md:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, ID (e.g. EMP-0001), or email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
          >
            <option value="All">All Departments</option>
            <option value="Research & Development">R&D</option>
            <option value="Sales">Sales</option>
            <option value="Human Resources">Human Resources</option>
          </select>

          <select
            value={riskLevel}
            onChange={(e) => {
              setRiskLevel(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
          >
            <option value="All">All Risk Levels</option>
            <option value="High">High Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="Low">Low Risk</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      {loading ? (
        <TableSkeleton rows={8} cols={6} />
      ) : employees.length === 0 ? (
        <EmptyState
          icon={FileSpreadsheet}
          title="No employees in directory"
          description="Your directory is currently empty. Upload your IBM HR dataset CSV or add employees manually."
          actionText="Upload Dataset CSV"
          onAction={() => setShowUploadModal(true)}
        />
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/75 dark:bg-slate-850/75 text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200/80 dark:border-slate-800/80">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Employee</th>
                  <th className="py-3.5 px-4 font-semibold">Department & Role</th>
                  <th className="py-3.5 px-4 font-semibold">Compensation</th>
                  <th className="py-3.5 px-4 font-semibold">Attrition Risk</th>
                  <th className="py-3.5 px-4 font-semibold">Tenure</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
                {employees.map((emp) => (
                  <tr
                    key={emp._id}
                    onClick={() => navigate(`/employees/${emp._id}`)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            emp.avatar ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(emp.name)}`
                          }
                          alt=""
                          className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">{emp.name}</p>
                          <p className="text-xs text-slate-400">{emp.employeeId} • {emp.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-medium text-slate-800 dark:text-slate-200 text-xs">{emp.JobRole}</p>
                      <p className="text-[11px] text-slate-400">{emp.Department}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-medium text-slate-800 dark:text-slate-200 text-xs">
                        ${emp.MonthlyIncome?.toLocaleString()}/mo
                      </p>
                      <p className="text-[11px] text-slate-400">Hike: +{emp.PercentSalaryHike}%</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <RiskBadge
                        riskLevel={emp.currentPrediction?.riskLevel}
                        probability={emp.currentPrediction?.probabilityLeaving}
                      />
                    </td>

                    <td className="py-3.5 px-4 text-xs text-slate-600 dark:text-slate-300">
                      {emp.YearsAtCompany} yrs at co.
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => handleQuickPredict(e, emp._id)}
                          disabled={actionLoading[emp._id]}
                          className="p-1.5 rounded-lg text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/60 transition-colors"
                          title="Run ML Prediction"
                        >
                          {actionLoading[emp._id] ? (
                            <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <BrainCircuit className="w-4 h-4" />
                          )}
                        </button>

                        <Link
                          to={`/employees/${emp._id}`}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        <Link
                          to={`/employees/${emp._id}/edit`}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit Employee"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => setDeleteTarget(emp)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors"
                          title="Delete Employee"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>
              Showing {(page - 1) * 10 + 1}–{Math.min(page * 10, total)} of {total} employees
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Page {page} of {totalPages || 1}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: UPLOAD CSV DATASET */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-500" /> Upload IBM HR CSV Dataset
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Import your employee dataset and run instant batch ML attrition predictions.
                </p>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                ✕
              </button>
            </div>

            {/* Template Download Prompt */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                <Info className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Compatible with standard IBM HR Attrition CSV format.</span>
              </div>
              <button
                type="button"
                onClick={handleDownloadSampleCSV}
                className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 hover:underline shrink-0"
              >
                <Download className="w-3.5 h-3.5" /> Sample CSV
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* File Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-400 rounded-2xl p-8 text-center cursor-pointer bg-slate-50 dark:bg-slate-850/50 transition-colors"
              >
                <UploadCloud className="w-10 h-10 text-brand-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {selectedFile ? selectedFile.name : 'Click to browse or drop your CSV file here'}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {selectedFile
                    ? `${(selectedFile.size / 1024).toFixed(1)} KB selected`
                    : 'Accepts .csv files (e.g. WA_Fn-UseC_-HR-Employee-Attrition.csv)'}
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Mode Selection */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Import Mode:</p>
                <div className="flex items-center gap-6 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="replaceMode"
                      checked={replaceExisting}
                      onChange={() => setReplaceExisting(true)}
                      className="text-brand-600 focus:ring-brand-500"
                    />
                    <span className="text-slate-700 dark:text-slate-300">Replace current workforce (Clean Slate)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="replaceMode"
                      checked={!replaceExisting}
                      onChange={() => setReplaceExisting(false)}
                      className="text-brand-600 focus:ring-brand-500"
                    />
                    <span className="text-slate-700 dark:text-slate-300">Append to current records</span>
                  </label>
                </div>
              </div>

              {uploadFeedback && (
                <div
                  className={`p-3 rounded-xl text-xs font-medium ${
                    uploadFeedback.type === 'success'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                      : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                  }`}
                >
                  {uploadFeedback.message}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !selectedFile}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white shadow-md shadow-brand-500/20 transition-all flex items-center gap-2"
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Parsing & Running ML Predictions...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Upload & Run Batch ML</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CLEAR ALL EMPLOYEES CONFIRMATION */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold">Clear All Employee Records?</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              This will remove all {total} employee records, historical predictions, and AI retention insights from your database so you can upload a fresh dataset.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowClearModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAllConfirm}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-colors"
              >
                Confirm Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DELETE INDIVIDUAL EMPLOYEE CONFIRMATION */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-lg font-bold">Delete Employee</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Are you sure you want to delete <strong>{deleteTarget.name}</strong> ({deleteTarget.employeeId})? This will permanently remove their records, prediction history, and AI insights.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
