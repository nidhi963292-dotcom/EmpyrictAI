const axios = require('axios');
const path = require('path');
const { spawn } = require('child_process');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

class MLService {
  /**
   * Health check for Python ML microservice
   */
  async checkHealth() {
    try {
      const response = await axios.get(`${ML_SERVICE_URL}/health`, { timeout: 3000 });
      return response.data;
    } catch (error) {
      return { status: 'offline', message: 'FastAPI microservice unreachable, using child-process fallback.' };
    }
  }

  /**
   * Predict single employee attrition using HTTP microservice or child process fallback
   */
  async predictSingle(employeeData) {
    // 1. Try FastAPI microservice first
    try {
      const response = await axios.post(
        `${ML_SERVICE_URL}/predict`,
        employeeData,
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 8000
        }
      );
      if (response.data && response.data.success) {
        return response.data.data;
      }
    } catch (httpError) {
      console.warn(`[MLService] HTTP call to ${ML_SERVICE_URL}/predict failed (${httpError.message}). Attempting Python child-process fallback...`);
    }

    // 2. Resilient Fallback: Run Python inference directly via child process
    return await this.runPythonInferenceFallback(employeeData);
  }

  /**
   * Run batch predictions on multiple employees
   */
  async predictBulk(employeesList) {
    try {
      const response = await axios.post(
        `${ML_SERVICE_URL}/predict/bulk`,
        employeesList,
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 15000
        }
      );
      if (response.data && response.data.success) {
        return response.data.data;
      }
    } catch (httpError) {
      console.warn(`[MLService] Bulk HTTP call failed (${httpError.message}). Processing sequentially via fallback...`);
      const results = [];
      for (const emp of employeesList) {
        const pred = await this.runPythonInferenceFallback(emp);
        results.push({ ...emp, ...pred });
      }
      return results;
    }
  }

  /**
   * Get global feature importance rankings
   */
  async getGlobalExplainability() {
    try {
      const response = await axios.get(`${ML_SERVICE_URL}/explain/global`, { timeout: 5000 });
      if (response.data && response.data.success) {
        return response.data.data;
      }
    } catch (error) {
      console.warn('[MLService] Global explainability HTTP failed, returning fallback metrics.');
      return {
        model_name: 'Logistic Regression',
        top_attrition_drivers: [
          { Feature: 'OverTime_Yes', Importance: 0.8646 },
          { Feature: 'BusinessTravel_Travel_Frequently', Importance: 0.7512 },
          { Feature: 'JobRole_Laboratory Technician', Importance: 0.7148 },
          { Feature: 'YearsSinceLastPromotion', Importance: 0.5287 },
          { Feature: 'NumCompaniesWorked', Importance: 0.4876 }
        ],
        top_retention_drivers: [
          { Feature: 'TotalWorkingYears', Importance: -0.5556 },
          { Feature: 'EnvironmentSatisfaction', Importance: -0.4817 },
          { Feature: 'JobSatisfaction', Importance: -0.4194 },
          { Feature: 'EducationField_Medical', Importance: -0.4145 },
          { Feature: 'Age', Importance: -0.4076 }
        ]
      };
    }
  }

  /**
   * Child Process Python Fallback for zero downtime
   */
  runPythonInferenceFallback(employeeData) {
    return new Promise((resolve, reject) => {
      const projectRoot = path.resolve(__dirname, '../../../');
      const venvPython = path.join(projectRoot, 'venv', 'Scripts', 'python.exe');
      const pythonExec = require('fs').existsSync(venvPython) ? venvPython : 'python';

      const script = `
import sys, json, os, pandas as pd
project_root = r"${projectRoot.replace(/\\/g, '/')}"
src_dir = os.path.join(project_root, "ml", "src")
sys.path.insert(0, src_dir)

from prediction_pipeline import predict_single_employee

input_data = json.loads(r'''${JSON.stringify(employeeData)}''')
df = pd.DataFrame([input_data])
result = predict_single_employee(df, explain=True)
print(json.dumps(result))
`;

      const pyProcess = spawn(pythonExec, ['-c', script], {
        cwd: path.join(projectRoot, 'ml')
      });

      let stdout = '';
      let stderr = '';

      pyProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      pyProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      pyProcess.on('close', (code) => {
        if (code !== 0) {
          console.error('[MLService Fallback Error]', stderr);
          return reject(new Error(`Python fallback process exited with code ${code}: ${stderr}`));
        }
        try {
          // Parse the JSON output line
          const lines = stdout.trim().split('\n');
          const jsonLine = lines[lines.length - 1];
          const parsed = JSON.parse(jsonLine);
          resolve(parsed);
        } catch (e) {
          reject(new Error(`Failed to parse Python fallback output: ${stdout}`));
        }
      });
    });
  }
}

module.exports = new MLService();
