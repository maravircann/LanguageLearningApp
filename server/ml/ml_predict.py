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
    script_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(script_dir, "ml_model.pkl")
    model = joblib.load(model_path)

    input_data = json.load(sys.stdin)

    features = pd.DataFrame([{
        "lessons_completed": input_data["lessons_completed"],
        "tests_completed": input_data["tests_completed"],
        "avg_lesson_time": input_data["avg_lesson_time"],
        "mistakes_per_test": input_data["mistakes_per_test"]
    }])

    prediction = model.predict(features)[0]

    feedback = []

    if input_data["avg_lesson_time"] < 60:
        feedback.append("You spend very little time on lessons. Try dedicating more time for deeper learning.")
    if input_data["avg_test_time"] < 30:
        feedback.append("You complete tests very quickly. Allocate more time to reflect on each answer.")
    if input_data["mistakes_per_test"] > 3:
        feedback.append("You average more than 3 mistakes per test. Review the concepts you missed and retake the challenging tests.")
    if input_data["progress_percent"] < 50:
        feedback.append("Your overall progress is below 50%. Aim to finish more lessons and tests.")

    suggestions_map = {
        "low": ["Review the basic lessons and increase consistency."],
        "medium": ["Diversify your exercises and focus on weak areas."],
        "high": ["Engage with real conversations and authentic texts."]
    }
    feedback.extend(suggestions_map.get(prediction, []))

    categories = ['Lessons', 'Tests', 'Avg Lesson Time', 'Avg Test Time', 'Mistakes/Test', 'Progress %']
    max_values = {
        "lessons_completed": 20,
        "tests_completed": 20,
        "avg_lesson_time": 10,
        "avg_test_time": 10,
        "mistakes_per_test": 5,
        "progress_percent": 100
    }

    normalized_values = [
        (input_data["lessons_completed"] / max_values["lessons_completed"]) * 100,
        (input_data["tests_completed"] / max_values["tests_completed"]) * 100,
        (input_data["avg_lesson_time"] / max_values["avg_lesson_time"]) * 100,
        (input_data["avg_test_time"] / max_values["avg_test_time"]) * 100,
        (input_data["mistakes_per_test"] / max_values["mistakes_per_test"]) * 100,
        input_data["progress_percent"]
    ]

    # Bar chart
    fig, ax = plt.subplots()
    ax.bar(categories, normalized_values, color='skyblue')
    ax.set_title("User Statistics")
    ax.set_ylim(0, 100)
    plt.xticks(rotation=30)
    plt.tight_layout()

    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    plt.close(fig)
    buf.seek(0)
    image_base64 = base64.b64encode(buf.read()).decode('utf-8')
    buf.close()

    # Radar chart (corectat)
    radar_values = normalized_values + [normalized_values[0]]
    angles = np.linspace(0, 2 * np.pi, len(categories), endpoint=False).tolist()
    angles += angles[:1]

    fig_radar, ax_radar = plt.subplots(subplot_kw={'projection': 'polar'})
    ax_radar.plot(angles, radar_values, color='dodgerblue', linewidth=2)
    ax_radar.fill(angles, radar_values, color='skyblue', alpha=0.4)
    ax_radar.set_title("User Performance Radar")
    ax_radar.set_xticks(angles[:-1])
    ax_radar.set_xticklabels(categories)
    ax_radar.set_yticks([20, 40, 60, 80, 100])
    ax_radar.set_ylim(0, 100)
    ax_radar.grid(True)

    buf_radar = io.BytesIO()
    plt.tight_layout()
    plt.savefig(buf_radar, format='png')
    plt.close(fig_radar)
    buf_radar.seek(0)
    radar_chart_base64 = base64.b64encode(buf_radar.read()).decode('utf-8')
    buf_radar.close()

    output = {
        "predicted_level": prediction,
        "suggestions": feedback,
        "bar_chart_base64": image_base64,
        "radar_chart_base64": radar_chart_base64
    }
    print(json.dumps(output))

except Exception as e:
    traceback.print_exc()
    print(json.dumps({ "error": str(e) }))
    sys.exit(1)
