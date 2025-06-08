import sys
import json
import joblib
import numpy as np
import os
import traceback
import pandas as pd
import matplotlib.pyplot as plt
import io
import base64

try:
    # Absolute path to the .pkl model file
    script_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(script_dir, "ml_model.pkl")
    model = joblib.load(model_path)

    # Read input JSON from stdin
    input_data = json.load(sys.stdin)

    # Create dataframe of features for prediction
    features = pd.DataFrame([{
        "lessons_completed": input_data["lessons_completed"],
        "tests_completed": input_data["tests_completed"],
        "avg_lesson_time": input_data["avg_lesson_time"],
        "mistakes_per_test": input_data["mistakes_per_test"]
    }])

    # Predict user level
    prediction = model.predict(features)[0]

    # Generate personalized feedback
    feedback = []

    if input_data["avg_lesson_time"] < 60:
        feedback.append("You spend very little time on lessons. Try dedicating more time for deeper learning.")

    if input_data["avg_test_time"] < 30:
        feedback.append("You complete tests very quickly. Allocate more time to reflect on each answer.")

    if input_data["mistakes_per_test"] > 3:
        feedback.append("You average more than 3 mistakes per test. Review the concepts you missed and retake the challenging tests.")

    if input_data["progress_percent"] < 50:
        feedback.append("Your overall progress is below 50%. Aim to finish more lessons and tests.")

    # Additional suggestions based on predicted level
    suggestions_map = {
        "low": ["Review the basic lessons and increase consistency."],
        "medium": ["Diversify your exercises and focus on weak areas."],
        "high": ["Engage with real conversations and authentic texts."]
    }
    feedback.extend(suggestions_map.get(prediction, []))

    # Plot user statistics
    fig, ax = plt.subplots()
    categories = ['Lessons', 'Tests', 'Avg Lesson Time', 'Avg Test Time', 'Mistakes/Test', 'Progress %']
    values = [
        input_data["lessons_completed"],
        input_data["tests_completed"],
        input_data["avg_lesson_time"],
        input_data["avg_test_time"],
        input_data["mistakes_per_test"],
        input_data["progress_percent"]
    ]

    ax.bar(categories, values)
    ax.set_title("User Statistics")
    plt.xticks(rotation=30)
    plt.tight_layout()

    # Save plot to in-memory buffer as base64
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    plt.close(fig)
    buf.seek(0)
    image_base64 = base64.b64encode(buf.read()).decode('utf-8')
    buf.close()

    # Prepare output JSON
    output = {
        "predicted_level": prediction,
        "suggestions": feedback,
        "chart_base64": image_base64
    }
    print(json.dumps(output))

except Exception as e:
    traceback.print_exc()
    print(json.dumps({ "error": str(e) }))
    sys.exit(1)
