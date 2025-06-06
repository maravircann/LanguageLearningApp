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
    # Cale absolută către fișierul .pkl
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

    # Predict level
    prediction = model.predict(features)[0]

    # Generează sugestii personalizate
    feedback = []

    if input_data["avg_lesson_time"] < 60:
        feedback.append("Petreci puțin timp în lecții. Încearcă să aloci mai mult timp pentru învățare aprofundată.")

    if input_data["avg_test_time"] < 30:
        feedback.append("Finalizezi testele foarte rapid. Alocă mai mult timp pentru a reflecta asupra fiecărui răspuns.")

    if input_data["mistakes_per_test"] > 3:
        feedback.append("Ai în medie peste 3 greșeli pe test. Revizuiește conceptele greșite și refă testele dificile.")

    if input_data["progress_percent"] < 50:
        feedback.append("Progresul tău este sub 50%. Încearcă să finalizezi mai multe lecții și teste.")

    suggestions_map = {
        "low": ["Reia lecțiile de bază și crește consistența."],
        "medium": ["Diversifică exercițiile și concentrează-te pe zonele problematice."],
        "high": ["Explorează conversații reale și texte autentice."]
    }
    feedback.extend(suggestions_map.get(prediction, []))

    fig, ax = plt.subplots()
    categories = ['Lecții', 'Teste', 'Timp Lecție', 'Timp Test', 'Greșeli', 'Progres %']
    values = [
        input_data["lessons_completed"],
        input_data["tests_completed"],
        input_data["avg_lesson_time"],
        input_data["avg_test_time"],
        input_data["mistakes_per_test"],
        input_data["progress_percent"]
    ]

    ax.bar(categories, values, color='skyblue')
    ax.set_title("Statistici utilizator")
    plt.xticks(rotation=30)
    plt.tight_layout()

    # Salvează imaginea în memorie (fără fișier pe disc)
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    plt.close(fig)
    buf.seek(0)
    image_base64 = base64.b64encode(buf.read()).decode('utf-8')
    buf.close()


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


