import os
import sys
import joblib

from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)

current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

try:
    from data_preprocessing import preprocess_data
except ImportError:
    from src.data_preprocessing import preprocess_data  # type: ignore[import-not-found]


# Load preprocessed data
(
    X_train,
    X_test,
    X_train_scaled,
    X_test_scaled,
    y_train,
    y_test,
    scaler,
    label_encoder
) = preprocess_data(verbose=False)

# Train Logistic Regression model
model = LogisticRegression(random_state=42, max_iter=1000)

model.fit(X_train_scaled, y_train)

# Make predictions
y_pred = model.predict(X_test_scaled)

# Model Evaluation
accuracy = accuracy_score(y_test, y_pred)

print("\n==============================")
print("Logistic Regression Results")
print("==============================")

print(f"\nAccuracy : {accuracy:.4f}")

print("\nClassification Report:")
print(classification_report(y_test, y_pred))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

# Save Model
current_dir = os.path.dirname(__file__)

models_path = os.path.join(current_dir, "..", "models")
os.makedirs(models_path, exist_ok=True)

model_path = os.path.join(models_path, "logistic_regression.pkl")

joblib.dump(model, model_path)

print("\nModel saved successfully!")