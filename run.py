import os
import sys
import argparse
import subprocess

# Auto-detect and switch to local virtual environment if not already active
root_dir = os.path.dirname(os.path.abspath(__file__))
venv_python = os.path.join(root_dir, "venv", "Scripts", "python.exe")
if os.path.exists(venv_python) and os.path.abspath(sys.executable).lower() != os.path.abspath(venv_python).lower():
    try:
        result = subprocess.run([venv_python] + sys.argv)
        sys.exit(result.returncode)
    except Exception as e:
        print(f"Notice: Failed to auto-switch to virtual environment: {e}")

# Set UTF-8 encoding for Windows terminals
if sys.platform.startswith("win"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Add ml/src to Python path so modules are accessible directly
root_dir = os.path.dirname(os.path.abspath(__file__))
src_dir = os.path.join(root_dir, "ml", "src")
if src_dir not in sys.path:
    sys.path.insert(0, src_dir)


def option_run_ai_hr_assistant():
    print("\n" + "=" * 65)
    print("▶ RUNNING END-TO-END AI HR ASSISTANT & PREDICTION")
    print("=" * 65)
    from test_ai_hr_assistant import employee_data
    from prediction_pipeline import predict_single_employee
    from ai_hr_assistant import generate_hr_analysis
    import pandas as pd

    df = pd.DataFrame([employee_data])
    print("\n[1/2] Generating ML Attrition Prediction & Feature Attribution...")
    prediction = predict_single_employee(df, explain=True)

    print(f"\n  • Attrition Prediction : {prediction['Prediction']}")
    print(f"  • Probability Leaving  : {prediction['Probability_Leaving']}%")
    print(f"  • Probability Staying  : {prediction['Probability_Staying']}%")
    print(f"  • Risk Level           : {prediction['Risk_Level']}")
    print(f"  • Baseline Recommendation : {prediction['Recommendation']}")

    if prediction.get("Top_Risk_Drivers"):
        print("\n  Top Risk Drivers:")
        for driver in prediction["Top_Risk_Drivers"]:
            print(f"    ▲ {driver}")

    if prediction.get("Top_Protective_Factors"):
        print("\n  Top Protective Factors:")
        for factor in prediction["Top_Protective_Factors"]:
            print(f"    ▼ {factor}")

    print("\n[2/2] Querying Groq AI for Personalized Retention Strategy...")
    try:
        analysis = generate_hr_analysis(employee_data, prediction)
        print("\n" + "-" * 65)
        print("GROQ AI HR RETENTION REPORT")
        print("-" * 65)
        print(analysis)
        print("-" * 65)
    except Exception as e:
        print(f"\n❌ Error contacting Groq API: {e}")
        print("Please check that GROQ_API_KEY is properly set in your .env file.")


def option_run_batch_predictions():
    print("\n" + "=" * 65)
    print("▶ RUNNING BATCH CSV PREDICTIONS")
    print("=" * 65)
    from test_custom_csv import csv_path, output_path
    from prediction_pipeline import predict_bulk_employees
    import pandas as pd

    if not os.path.exists(csv_path):
        print(f"❌ Input CSV not found at: {csv_path}")
        return

    employees = pd.read_csv(csv_path)
    print(f"Loaded {len(employees)} employee records from:\n  {csv_path}\n")

    predictions = predict_bulk_employees(employees)
    predictions.to_csv(output_path, index=False)

    print(predictions[["Prediction", "Probability_Leaving", "Probability_Staying", "Risk_Level", "Recommendation"]])
    print(f"\n✅ Batch predictions saved to:\n  {output_path}")


def option_run_explainability():
    print("\n" + "=" * 65)
    print("▶ COMPUTING ML FEATURE IMPORTANCE & EXPLAINABILITY")
    print("=" * 65)
    from explainability import compute_global_feature_importance, plot_employee_risk_breakdown
    from test_explainability import run_explainability_test

    run_explainability_test()


def option_retrain_all_models():
    print("\n" + "=" * 65)
    print("▶ RETRAINING & EVALUATING ALL MODELS")
    print("=" * 65)
    from data_preprocessing import preprocess_data
    import train_logistic_regression
    import train_random_forest
    import evaluate_models

    print("\n✅ All models retrained, evaluated, and deployed successfully!")


def option_test_groq_connection():
    print("\n" + "=" * 65)
    print("▶ TESTING GROQ API CONNECTION")
    print("=" * 65)
    from ai_hr_assistant import test_groq_connection

    try:
        response = test_groq_connection()
        print("\n✅ Groq Response:")
        print(response)
    except Exception as e:
        print(f"\n❌ Groq Connection Failed: {e}")
        print("Please verify GROQ_API_KEY in your .env file.")


def run_interactive_menu():
    while True:
        print("\n" + "=" * 65)
        print("      🌟 EMPYRICT-AI: EMPLOYEE ATTRITION SYSTEM 🌟")
        print("=" * 65)
        print("  1. 👤 Run AI HR Assistant (ML Prediction + Groq Retention Plan)")
        print("  2. 📊 Run Batch Predictions on CSV (dataset/test_employees.csv)")
        print("  3. 📈 Compute Feature Importance & Generate Charts")
        print("  4. 🔄 Retrain & Evaluate All Models")
        print("  5. ⚡ Test Groq API Connection")
        print("  6. 🚀 Run Complete End-to-End Suite")
        print("  0. ❌ Exit")
        print("=" * 65)

        choice = input("Select an option (0-6): ").strip()

        if choice == "1":
            option_run_ai_hr_assistant()
        elif choice == "2":
            option_run_batch_predictions()
        elif choice == "3":
            option_run_explainability()
        elif choice == "4":
            option_retrain_all_models()
        elif choice == "5":
            option_test_groq_connection()
        elif choice == "6":
            option_retrain_all_models()
            option_run_explainability()
            option_run_batch_predictions()
            option_run_ai_hr_assistant()
        elif choice == "0" or choice.lower() in ["exit", "q", "quit"]:
            print("\nExiting Empyrict-AI. Goodbye! 👋\n")
            break
        else:
            print("\n⚠️ Invalid selection. Please enter a number between 0 and 6.")


def main():
    parser = argparse.ArgumentParser(description="Empyrict-AI Master Runner")
    parser.add_argument("--predict", action="store_true", help="Run AI HR Assistant prediction & retention plan")
    parser.add_argument("--batch", action="store_true", help="Run batch predictions on test CSV")
    parser.add_argument("--explain", action="store_true", help="Compute feature importance and generate charts")
    parser.add_argument("--train", action="store_true", help="Retrain and evaluate models")
    parser.add_argument("--test-ai", action="store_true", help="Test Groq API connection")
    parser.add_argument("--all", action="store_true", help="Run the full pipeline suite")

    args = parser.parse_args()

    if args.predict:
        option_run_ai_hr_assistant()
    elif args.batch:
        option_run_batch_predictions()
    elif args.explain:
        option_run_explainability()
    elif args.train:
        option_retrain_all_models()
    elif args.test_ai:
        option_test_groq_connection()
    elif args.all:
        option_retrain_all_models()
        option_run_explainability()
        option_run_batch_predictions()
        option_run_ai_hr_assistant()
    else:
        run_interactive_menu()


if __name__ == "__main__":
    main()
