import os
import sys
import json
from dotenv import load_dotenv
from groq import Groq

if sys.platform.startswith("win"):
    try:
        if hasattr(sys.stdout, "reconfigure"):
            getattr(sys.stdout, "reconfigure")(encoding="utf-8")
    except Exception:
        pass


# ============================================================
# LOAD ENVIRONMENT VARIABLES
# ============================================================

current_dir = os.path.dirname(__file__)

project_root = os.path.abspath(
    os.path.join(current_dir, "..", "..")
)

env_path = os.path.join(
    project_root,
    ".env"
)

if os.path.exists(env_path):
    load_dotenv(env_path)
else:
    load_dotenv()


# ============================================================
# INITIALIZE GROQ CLIENT
# ============================================================

def get_groq_client() -> Groq:
    """Retrieve and validate the Groq client lazily."""
    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key:
        raise ValueError(
            "GROQ_API_KEY not found. "
            "Please add it to your .env file."
        )
    return Groq(api_key=groq_api_key)


# ============================================================
# TEST GROQ CONNECTION
# ============================================================

def test_groq_connection():
    client = get_groq_client()
    response = client.chat.completions.create(


        model="openai/gpt-oss-20b",

        messages=[
            {
                "role": "system",
                "content": (
                    "You are an AI assistant for an HR "
                    "Employee Attrition Prediction System."
                )
            },
            {
                "role": "user",
                "content": (
                    "Say hello and confirm that the "
                    "AI HR Assistant is working."
                )
            }
        ]
    )

    return response.choices[0].message.content


# ============================================================
# AI HR ANALYSIS
# ============================================================

def generate_hr_analysis(
    employee_data,
    prediction_result
):

    risk_drivers = prediction_result.get("Top_Risk_Drivers", [])
    protective_factors = prediction_result.get("Top_Protective_Factors", [])

    prompt = f"""
You are an AI HR Assistant for an Employee Attrition Prediction and Analytics Platform.

Analyze the employee information, the machine learning prediction, and the quantitative model explainability drivers provided below.

IMPORTANT:
- Do not change or question the ML prediction.
- Use the ML prediction and feature importance drivers as evidence-based decision-support information.
- Specifically address the top quantitative risk factors identified by the ML model in your recommendations.
- Do not make unsupported claims about the employee.
- Keep the response professional, concise, and structured.

EMPLOYEE PROFILE:
{json.dumps(employee_data, indent=2) if isinstance(employee_data, dict) else employee_data}

ML PREDICTION RESULT:
- Attrition Prediction: {prediction_result.get('Prediction')}
- Probability of Leaving: {prediction_result.get('Probability_Leaving')}%
- Probability of Staying: {prediction_result.get('Probability_Staying')}%
- Risk Level: {prediction_result.get('Risk_Level')}
- Baseline Recommendation: {prediction_result.get('Recommendation')}

QUANTITATIVE ATTRITION RISK DRIVERS (FROM ML EXPLAINABILITY):
- Key Factors Increasing Risk: {', '.join(risk_drivers) if risk_drivers else 'None identified'}
- Protective Factors Reducing Risk: {', '.join(protective_factors) if protective_factors else 'None identified'}

Provide the response in the following format:

EMPLOYEE PRIORITY:
Explain whether this employee requires Low, Medium, or High HR attention.

KEY RISK FACTORS (DATA-BACKED):
Analyze the top factors that are mathematically and contextually driving this employee's attrition risk.

RECOMMENDED HR ACTIONS:
Provide 3 to 5 practical, prioritized actions HR and leadership can take, directly targeting the identified risk factors.

RETENTION STRATEGY:
Provide a personalized retention and engagement plan to mitigate the primary drivers of turnover and maximize long-term commitment.
"""

    client = get_groq_client()
    response = client.chat.completions.create(

        model="openai/gpt-oss-20b",

        messages=[
            {
                "role": "system",
                "content": (
                    "You are a professional AI HR decision "
                    "support assistant. Provide practical, "
                    "ethical, and evidence-based HR guidance."
                )
            },
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response.choices[0].message.content


# ============================================================
# MAIN TEST
# ============================================================

if __name__ == "__main__":

    print("=" * 60)
    print("GROQ AI HR ASSISTANT TEST")
    print("=" * 60)

    response = test_groq_connection()

    print("\nAI Response:\n")
    print(response)