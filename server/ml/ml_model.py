import pandas as pd
from sklearn.tree import DecisionTreeClassifier
import joblib

# 1. Load the dataset
df = pd.read_csv("rapoarte.csv")

# 2. Create the target column based on progress_percent
def classify_level(p):
    if p < 40:
        return "low"
    elif p < 70:
        return "medium"
    else:
        return "high"

df["user_level"] = df["progress_percent"].apply(classify_level)

# 3. Define input features (X) and target (y)
X = df[["lessons_completed", "tests_completed", "avg_lesson_time", "mistakes_per_test"]]
y = df["user_level"]

# 4. Train the model
model = DecisionTreeClassifier()
model.fit(X, y)

# 5. Save the model
joblib.dump(model, "ml_model.pkl")

print("Model trained and saved successfully.")
