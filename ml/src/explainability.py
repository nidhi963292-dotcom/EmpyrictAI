import os
import json
import joblib
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# ============================================================
# PATHS
# ============================================================

current_dir = os.path.dirname(__file__)
models_path = os.path.join(current_dir, "..", "models")

deployment_config_path = os.path.join(models_path, "deployment_config.json")
feature_columns_path = os.path.join(models_path, "feature_columns.pkl")
scaler_path = os.path.join(models_path, "scaler.pkl")


# ============================================================
# HELPER: LOAD ACTIVE MODEL & ARTIFACTS
# ============================================================

def load_explainability_artifacts():
    """Loads feature columns, scaler, and active model."""
    if not os.path.exists(deployment_config_path):
        raise FileNotFoundError("deployment_config.json not found. Run evaluate_models.py first.")

    with open(deployment_config_path, "r") as f:
        config = json.load(f)

    model_file = config["model_file"]
    model_path = os.path.join(models_path, model_file)
    model = joblib.load(model_path)
    feature_columns = joblib.load(feature_columns_path)

    scaler = None
    if config.get("requires_scaling", False) and os.path.exists(scaler_path):
        scaler = joblib.load(scaler_path)

    return model, feature_columns, scaler, config["best_model"]


# ============================================================
# GLOBAL FEATURE IMPORTANCE
# ============================================================

def compute_global_feature_importance():
    """
    Computes global feature importance for the active model
    and saves both a visualization and a JSON summary.
    """
    model, feature_columns, scaler, model_name = load_explainability_artifacts()

    importance_df = pd.DataFrame()
    importance_df["Feature"] = feature_columns

    if hasattr(model, "coef_"):
        # Linear / Logistic Regression model
        importance_df["Importance"] = model.coef_[0]
        importance_df["Abs_Importance"] = np.abs(model.coef_[0])
        importance_df = importance_df.sort_values(by="Abs_Importance", ascending=False)
        metric_label = "Model Coefficient (Log-Odds Impact)"
    elif hasattr(model, "feature_importances_"):
        # Tree-based model (Random Forest)
        importance_df["Importance"] = model.feature_importances_
        importance_df["Abs_Importance"] = model.feature_importances_
        importance_df = importance_df.sort_values(by="Importance", ascending=False)
        metric_label = "Gini Feature Importance"
    else:
        raise ValueError(f"Model type {type(model)} does not expose coef_ or feature_importances_.")

    # Save to JSON
    pos_mask = importance_df["Importance"] > 0
    top_pos_df = pd.DataFrame(importance_df[pos_mask]).head(10)[["Feature", "Importance"]]
    top_positive = top_pos_df.to_dict(orient="records")

    neg_mask = importance_df["Importance"] < 0
    top_neg_df = pd.DataFrame(importance_df[neg_mask]).head(10)[["Feature", "Importance"]]
    top_negative = top_neg_df.to_dict(orient="records")

    global_data = {
        "model_name": model_name,
        "metric": metric_label,
        "top_attrition_drivers": top_positive,
        "top_retention_drivers": top_negative,
        "all_features_ranked": pd.DataFrame(importance_df[["Feature", "Importance"]]).to_dict(orient="records")
    }

    json_output_path = os.path.join(models_path, "global_feature_importance.json")
    with open(json_output_path, "w") as f:
        json.dump(global_data, f, indent=4)

    # Plot Global Importance
    top_plot = importance_df.head(15).sort_values(by="Importance", ascending=True)
    plt.figure(figsize=(10, 7), dpi=150)
    
    colors = ["#e74c3c" if val > 0 else "#2ecc71" for val in top_plot["Importance"]]
    bars = plt.barh(top_plot["Feature"], top_plot["Importance"], color=colors, edgecolor="none")
    plt.title(f"Top 15 Global Feature Drivers ({model_name})", fontsize=14, fontweight="bold", pad=15)
    plt.xlabel(metric_label, fontsize=11)
    plt.grid(axis="x", linestyle="--", alpha=0.5)
    plt.tight_layout()

    chart_output_path = os.path.join(models_path, "global_feature_importance.png")
    plt.savefig(chart_output_path)
    plt.close()

    print(f"Global feature importance saved to:")
    print(f" - JSON: {json_output_path}")
    print(f" - Chart: {chart_output_path}")

    return global_data


# ============================================================
# LOCAL (PER-EMPLOYEE) FEATURE ATTRIBUTION
# ============================================================

def explain_single_employee(processed_features, raw_employee_df=None, top_n=5):
    """
    Computes local feature contributions for a single employee instance.

    Parameters
    ----------
    processed_features : numpy.ndarray or pandas.DataFrame
        Preprocessed (encoded & scaled if necessary) feature vector of shape (1, num_features).
    raw_employee_df : pandas.DataFrame, optional
        Original unencoded employee row for human-readable feature values.
    top_n : int, default=5
        Number of top risk-increasing and risk-reducing factors to return.

    Returns
    -------
    dict
        Dictionary containing top risk drivers, protective factors, and all contributions.
    """
    model, feature_columns, scaler, model_name = load_explainability_artifacts()

    if isinstance(processed_features, pd.DataFrame):
        feature_vals = processed_features.values[0]
    elif isinstance(processed_features, np.ndarray):
        feature_vals = processed_features.flatten()
    else:
        raise TypeError("processed_features must be a DataFrame or numpy array.")

    contributions = []

    if hasattr(model, "coef_"):
        # Logistic Regression: contribution = w_i * x_i
        coefs = model.coef_[0]
        for feat, val, w in zip(feature_columns, feature_vals, coefs):
            contrib = float(w * val)
            contributions.append({
                "feature": feat,
                "contribution": round(contrib, 4),
                "weight": round(float(w), 4),
                "scaled_value": round(float(val), 4)
            })
    else:
        # Tree-based model fallback: scaled importance
        importances = model.feature_importances_
        for feat, val, imp in zip(feature_columns, feature_vals, importances):
            contrib = float(imp * (val if abs(val) > 0 else 0))
            contributions.append({
                "feature": feat,
                "contribution": round(contrib, 4),
                "importance": round(float(imp), 4)
            })

    # Sort contributions
    contrib_df = pd.DataFrame(contributions).sort_values(by=["contribution"], ascending=[False])

    risk_mask = contrib_df["contribution"] > 0
    top_risk_df = pd.DataFrame(contrib_df[risk_mask]).head(top_n)
    top_risk_increasing = top_risk_df.to_dict(orient="records")

    prot_mask = contrib_df["contribution"] < 0
    top_prot_df = pd.DataFrame(contrib_df[prot_mask]).sort_values(by=["contribution"], ascending=[True]).head(top_n)
    top_protective = top_prot_df.to_dict(orient="records")

    return {
        "model_name": model_name,
        "top_risk_factors": top_risk_increasing,
        "top_protective_factors": top_protective,
        "all_contributions": contrib_df.to_dict(orient="records")
    }


# ============================================================
# PLOT LOCAL EMPLOYEE BREAKDOWN
# ============================================================

def plot_employee_risk_breakdown(explanation, output_path=None):
    """
    Plots a waterfall/horizontal bar chart of the employee's top risk drivers
    and protective factors.
    """
    if output_path is None:
        output_path = os.path.join(models_path, "employee_risk_breakdown.png")

    risk_factors = pd.DataFrame(explanation["top_risk_factors"])
    protective_factors = pd.DataFrame(explanation["top_protective_factors"])

    combined = pd.concat([protective_factors, risk_factors]).dropna(subset=["feature"])
    combined = combined.sort_values(by="contribution", ascending=True)

    plt.figure(figsize=(10, 6), dpi=150)
    colors = ["#e74c3c" if c > 0 else "#2ecc71" for c in combined["contribution"]]

    plt.barh(combined["feature"], combined["contribution"], color=colors, edgecolor="none")
    plt.title(
        f"Employee Risk Drivers Breakdown ({explanation['model_name']})",
        fontsize=13,
        fontweight="bold",
        pad=15
    )
    plt.xlabel("Contribution to Attrition Score (Positive = Higher Risk, Negative = Retention Factor)", fontsize=10)
    plt.axvline(0, color="black", linestyle="--", linewidth=0.8, alpha=0.7)
    plt.grid(axis="x", linestyle=":", alpha=0.6)
    plt.tight_layout()

    plt.savefig(output_path)
    plt.close()
    return output_path


if __name__ == "__main__":
    compute_global_feature_importance()
