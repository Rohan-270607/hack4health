import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, ExtraTreesRegressor
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score,
    explained_variance_score
)

df = pd.read_csv("dataset.csv")

features = [
    "Sleep_Quality",
    "Social_Engagement",
    "Daily_App_Usage_Min",
    "Typing_Speed_WPM",
    "Session_Frequency",
    "Idle_Time_Min",
    "Facial_Emotion_Variance",
    "Eye_Blink_Rate",
    "Smile_Intensity",
    "Head_Motion_Index",
    "MFCC_Mean",
    "MFCC_Variance",
    "Pitch_Mean",
    "Speech_Rate",
    "Heart_Rate_BPM",
    "HRV_Index",
    "Skin_Temperature",
    "GSR_Level"
]

targets = [
    "Depression_Score",
    "Anxiety_Score",
    "Stress_Score"
]

X = df[features]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    df[targets],
    test_size=0.2,
    random_state=42
)

models = {
    "Random Forest": RandomForestRegressor(
        n_estimators=500,
        random_state=42,
        n_jobs=-1,
        max_features="sqrt"
    ),

    "Extra Trees": ExtraTreesRegressor(
        n_estimators=500,
        random_state=42,
        n_jobs=-1,
        max_features=1.0
    )
}

for name, model in models.items():

    print("\n" + "=" * 60)
    print(name)
    print("=" * 60)

    model.fit(X_train, y_train)

    predictions = model.predict(X_test)

    for i, target in enumerate(targets):

        actual = y_test.iloc[:, i]
        predicted = predictions[:, i]

        mae = mean_absolute_error(actual, predicted)
        mse = mean_squared_error(actual, predicted)
        rmse = np.sqrt(mse)
        r2 = r2_score(actual, predicted)
        ev = explained_variance_score(actual, predicted)

        print("\n" + target)
        print("-" * len(target))
        print(f"MAE:                 {mae:.4f}")
        print(f"MSE:                 {mse:.4f}")
        print(f"RMSE:                {rmse:.4f}")
        print(f"R2:                  {r2:.4f}")
        print(f"Explained Variance:  {ev:.4f}")

    print("\nOverall:")
    print(f"MAE: {mean_absolute_error(y_test, predictions):.4f}")
    print(f"RMSE: {np.sqrt(mean_squared_error(y_test, predictions)):.4f}")
    print(f"R2: {r2_score(y_test, predictions, multioutput='uniform_average'):.4f}")
    print(
        f"Explained Variance: "
        f"{explained_variance_score(y_test, predictions, multioutput='uniform_average'):.4f}"
    )