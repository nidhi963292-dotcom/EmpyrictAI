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
    from explainability import (
        compute_global_feature_importance,
        explain_single_employee,
        plot_employee_risk_breakdown
    )
    from prediction_pipeline import predict_single_employee, preprocess_input
except ImportError:
    from src.explainability import (  # type: ignore[import-not-found]
        compute_global_feature_importance,
        explain_single_employee,
        plot_employee_risk_breakdown
    )
    from src.prediction_pipeline import predict_single_employee, preprocess_input  # type: ignore[import-not-found]



def run_explainability_test():
    print("=" * 65)
    print("EMPYRICT-AI: ML EXPLAINABILITY & FEATURE ATTRIBUTION TEST")
    print("=" * 65)

    # 1. Test Global Feature Importance
    print("\n[1/3] Computing Global Feature Importance...")
    global_info = compute_global_feature_importance()

    print(f"\nModel: {global_info['model_name']} ({global_info['metric']})")
    print("\nTop 5 Overall Attrition Drivers (Increasing Risk):")
    for idx, item in enumerate(global_info["top_attrition_drivers"][:5], 1):
        print(f"  {idx}. {item['Feature']:<30} : {item['Importance']:+.4f}")

    print("\nTop 5 Overall Retention Factors (Reducing Risk):")
    for idx, item in enumerate(global_info["top_retention_drivers"][:5], 1):
        print(f"  {idx}. {item['Feature']:<30} : {item['Importance']:+.4f}")

    # 2. Test Local Employee Attribution
    print("\n" + "=" * 65)
    print("[2/3] Testing Local (Per-Employee) Feature Attribution...")

    test_employee = {
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

    df = pd.DataFrame([test_employee])
    prediction = predict_single_employee(df, explain=True)

    print(f"\nPrediction Outcome   : {prediction['Prediction']}")
    print(f"Attrition Probability: {prediction['Probability_Leaving']}%")
    print(f"Risk Level           : {prediction['Risk_Level']}")

    print("\nTop Individual Risk Drivers for this Employee:")
    for driver in prediction.get("Top_Risk_Drivers", []):
        print(f"  ▲ {driver}")

    print("\nTop Individual Protective Factors for this Employee:")
    for factor in prediction.get("Top_Protective_Factors", []):
        print(f"  ▼ {factor}")

    # 3. Plot Employee Breakdown
    print("\n" + "=" * 65)
    print("[3/3] Generating Individual Risk Breakdown Waterfall Chart...")
    if prediction.get("Explanation"):
        chart_path = plot_employee_risk_breakdown(prediction["Explanation"])
        print(f"Individual risk breakdown chart saved to:\n  {chart_path}")

    print("\n" + "=" * 65)
    print("EXPLAINABILITY TEST COMPLETED SUCCESSFULLY!")
    print("=" * 65)


if __name__ == "__main__":
    run_explainability_test()
