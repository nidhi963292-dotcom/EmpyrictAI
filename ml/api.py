import os
import sys
import pandas as pd
from typing import Dict, Any, List
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware

# Set UTF-8 encoding for Windows
if sys.platform.startswith("win"):
    try:
        if hasattr(sys.stdout, "reconfigure"):
            getattr(sys.stdout, "reconfigure")(encoding="utf-8")
    except Exception:
        pass

# Ensure ml and ml/src are on sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
src_dir = os.path.join(current_dir, "src")
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)
if src_dir not in sys.path:
    sys.path.insert(0, src_dir)

try:
    from src.prediction_pipeline import (  # type: ignore[import-not-found]
        predict_single_employee,
        predict_bulk_employees,
        feature_columns,
        requires_scaling,
    )
    from src.explainability import (  # type: ignore[import-not-found]
        compute_global_feature_importance,
        load_explainability_artifacts,
    )
    from src.ai_hr_assistant import generate_hr_analysis  # type: ignore[import-not-found]
except ImportError:
    from prediction_pipeline import (  # type: ignore[import-not-found]
        predict_single_employee,
        predict_bulk_employees,
        feature_columns,
        requires_scaling,
    )
    from explainability import (  # type: ignore[import-not-found]
        compute_global_feature_importance,
        load_explainability_artifacts,
    )
    from ai_hr_assistant import generate_hr_analysis  # type: ignore[import-not-found]


app = FastAPI(
    title="Empyrict-AI ML Microservice",
    description="Machine Learning & Groq AI inference microservice for Employee Attrition Analytics",
    version="1.0.0"
)

# Enable CORS for backend & client access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    """Health check returning ML model status and loaded feature count."""
    try:
        _, _, _, best_model_name = load_explainability_artifacts()
        return {
            "status": "healthy",
            "service": "Empyrict-AI ML Microservice",
            "model_name": best_model_name,
            "features_count": len(feature_columns),
            "requires_scaling": requires_scaling
        }
    except Exception as e:
        return {
            "status": "degraded",
            "error": str(e)
        }


@app.post("/predict")
def predict_employee(employee: Dict[str, Any] = Body(...)):
    """
    Predict attrition probability, risk level, and feature attribution
    for a single employee record.
    """
    try:
        # Convert dictionary to DataFrame
        df = pd.DataFrame([employee])
        result = predict_single_employee(df, explain=True)
        return {
            "success": True,
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


@app.post("/predict/bulk")
def predict_employees_bulk(employees: List[Dict[str, Any]] = Body(...)):
    """
    Run batch prediction across multiple employee records.
    """
    try:
        if not employees:
            raise HTTPException(status_code=400, detail="Empty employee list provided.")
        df = pd.DataFrame(employees)
        result_df = predict_bulk_employees(df)
        records = result_df.to_dict(orient="records")
        return {
            "success": True,
            "count": len(records),
            "data": records
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Bulk prediction error: {str(e)}")


@app.post("/ai-analysis")
def generate_ai_analysis(payload: Dict[str, Any] = Body(...)):
    """
    Generate Groq-powered HR retention analysis and decision support.
    """
    try:
        employee_data = payload.get("employee_data", {})
        prediction_result = payload.get("prediction_result", {})

        if not employee_data or not prediction_result:
            raise HTTPException(
                status_code=400,
                detail="Payload must include both 'employee_data' and 'prediction_result'."
            )

        analysis = generate_hr_analysis(employee_data, prediction_result)
        return {
            "success": True,
            "analysis": analysis
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Analysis error: {str(e)}")


@app.get("/explain/global")
def get_global_explainability():
    """
    Get top global positive (risk) and negative (retention) drivers across all features.
    """
    try:
        global_info = compute_global_feature_importance()
        return {
            "success": True,
            "data": global_info
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Explainability error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("api:app", host="0.0.0.0", port=port, reload=True, app_dir=current_dir)
