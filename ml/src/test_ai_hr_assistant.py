import os
import sys
import pandas as pd

if sys.platform.startswith("win"):
    try:
        if hasattr(sys.stdout, "reconfigure"):
            getattr(sys.stdout, "reconfigure")(encoding="utf-8")
    except Exception:
        pass

current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

try:
    from prediction_pipeline import predict_single_employee
    from ai_hr_assistant import generate_hr_analysis
except ImportError:
    from src.prediction_pipeline import predict_single_employee  # type: ignore[import-not-found]
    from src.ai_hr_assistant import generate_hr_analysis  # type: ignore[import-not-found]



# ============================================================
# CREATE CUSTOM / LIVE EMPLOYEE DATA
# ============================================================

employee_data = {
    "Age": 28,
    "BusinessTravel": "Travel_Frequently",
    "DailyRate": 500,
    "Department": "Sales",
    "DistanceFromHome": 25,
    "Education": 2,
    "EducationField": "Marketing",
    "EnvironmentSatisfaction": 1,
    "Gender": "Male",
    "HourlyRate": 40,
    "JobInvolvement": 1,
    "JobLevel": 1,
    "JobRole": "Sales Representative",
    "JobSatisfaction": 1,
    "MaritalStatus": "Single",
    "MonthlyIncome": 2500,
    "MonthlyRate": 15000,
    "NumCompaniesWorked": 5,
    "OverTime": "Yes",
    "PercentSalaryHike": 10,
    "PerformanceRating": 3,
    "RelationshipSatisfaction": 1,
    "StockOptionLevel": 0,
    "TotalWorkingYears": 4,
    "TrainingTimesLastYear": 1,
    "WorkLifeBalance": 1,
    "YearsAtCompany": 1,
    "YearsInCurrentRole": 0,
    "YearsSinceLastPromotion": 0,
    "YearsWithCurrManager": 0
}


# ============================================================
# CONVERT EMPLOYEE DATA TO DATAFRAME
# ============================================================

employee_df = pd.DataFrame([employee_data])


# ============================================================
# DISPLAY INPUT DATA
# ============================================================

print("=" * 60)
print("CUSTOM EMPLOYEE DATA")
print("=" * 60)

for key, value in employee_data.items():
    print(f"{key}: {value}")


# ============================================================
# ML MODEL PREDICTION
# ============================================================

print("\n")
print("=" * 60)
print("ML EMPLOYEE ATTRITION PREDICTION")
print("=" * 60)

prediction_result = predict_single_employee(
    employee_df
)

print(
    f"Prediction           : "
    f"{prediction_result['Prediction']}"
)

print(
    f"Probability Leaving  : "
    f"{prediction_result['Probability_Leaving']}%"
)

print(
    f"Probability Staying  : "
    f"{prediction_result['Probability_Staying']}%"
)

print(
    f"Risk Level           : "
    f"{prediction_result['Risk_Level']}"
)

print(
    f"Recommendation       : "
    f"{prediction_result['Recommendation']}"
)


# ============================================================
# GROQ AI HR ANALYSIS
# ============================================================

print("\n")
print("=" * 60)
print("GROQ AI HR ANALYSIS")
print("=" * 60)


# Send the SAME employee data and ML prediction to Groq
ai_analysis = generate_hr_analysis(
    employee_data,
    prediction_result
)


# ============================================================
# DISPLAY GROQ RESPONSE
# ============================================================

print("\n")
print(ai_analysis)


# ============================================================
# TEST COMPLETED
# ============================================================

print("\n")
print("=" * 60)
print("ML + GROQ TEST COMPLETED SUCCESSFULLY")
print("=" * 60)