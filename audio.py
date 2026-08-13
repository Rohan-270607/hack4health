import pandas as pd
import numpy as np

from sklearn.model_selection import GroupShuffleSplit
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

from sklearn.ensemble import (
    RandomForestClassifier,
    ExtraTreesClassifier,
    HistGradientBoostingClassifier
)

from sklearn.svm import SVC

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    confusion_matrix,
    roc_auc_score
)


# ============================================================
# LOAD DATA
# ============================================================

DATA_FILE = "audio_features.csv"

df = pd.read_csv(DATA_FILE)

print("=" * 60)
print("AUDIO EMOTION MODEL")
print("=" * 60)

print()
print("Dataset shape:")
print(df.shape)

print()
print("Emotion distribution:")
print(df["emotion"].value_counts())


# ============================================================
# FEATURES
# ============================================================

# IMPORTANT:
# Do NOT use emotion_code because it directly encodes the target.
#
# Do NOT use actor_id because we use it only for grouping.
#
# filename/filepath are metadata and must not be model features.
#
# sample_rate is essentially constant and therefore useless.

excluded_columns = [
    "filepath",
    "filename",
    "actor_id",
    "emotion",
    "emotion_code",
    "intensity_code",
    "statement_code",
    "repetition_code",
    "sample_rate"
]

feature_columns = [
    column
    for column in df.columns
    if column not in excluded_columns
]

X = df[feature_columns]
y = df["emotion"]
groups = df["actor_id"]


print()
print("Number of features:", len(feature_columns))

print()
print("Features:")
for feature in feature_columns:
    print(feature)


# ============================================================
# HANDLE MISSING / INFINITE VALUES
# ============================================================

X = X.replace(
    [np.inf, -np.inf],
    np.nan
)

X = X.fillna(
    X.median(numeric_only=True)
)


# ============================================================
# ACTOR-BASED TRAIN / TEST SPLIT
# ============================================================

splitter = GroupShuffleSplit(
    n_splits=1,
    test_size=0.20,
    random_state=42
)

train_indices, test_indices = next(
    splitter.split(
        X,
        y,
        groups=groups
    )
)

X_train = X.iloc[train_indices]
X_test = X.iloc[test_indices]

y_train = y.iloc[train_indices]
y_test = y.iloc[test_indices]


print()
print("=" * 60)
print("TRAIN / TEST SPLIT")
print("=" * 60)

print(
    "Training samples:",
    len(X_train)
)

print(
    "Testing samples:",
    len(X_test)
)

print(
    "Training actors:",
    df.iloc[train_indices]["actor_id"].nunique()
)

print(
    "Testing actors:",
    df.iloc[test_indices]["actor_id"].nunique()
)


# ============================================================
# MODELS
# ============================================================

models = {

    "Random Forest":
        RandomForestClassifier(
            n_estimators=300,
            random_state=42,
            n_jobs=-1,
            class_weight="balanced"
        ),

    "Extra Trees":
        ExtraTreesClassifier(
            n_estimators=300,
            random_state=42,
            n_jobs=-1,
            class_weight="balanced"
        ),

    "Hist Gradient Boosting":
        HistGradientBoostingClassifier(
            max_iter=300,
            learning_rate=0.05,
            max_leaf_nodes=31,
            random_state=42
        ),

    "SVM":
        Pipeline([
            (
                "scaler",
                StandardScaler()
            ),
            (
                "classifier",
                SVC(
                    kernel="rbf",
                    C=10,
                    probability=True,
                    random_state=42
                )
            )
        ])
}


results = []


# ============================================================
# TRAIN + TEST
# ============================================================

for model_name, model in models.items():

    print()
    print("=" * 60)
    print(model_name)
    print("=" * 60)

    print("Training...")

    model.fit(
        X_train,
        y_train
    )

    predictions = model.predict(
        X_test
    )

    probabilities = model.predict_proba(
        X_test
    )

    accuracy = accuracy_score(
        y_test,
        predictions
    )

    precision = precision_score(
        y_test,
        predictions,
        average="macro",
        zero_division=0
    )

    recall = recall_score(
        y_test,
        predictions,
        average="macro",
        zero_division=0
    )

    macro_f1 = f1_score(
        y_test,
        predictions,
        average="macro",
        zero_division=0
    )

    weighted_f1 = f1_score(
        y_test,
        predictions,
        average="weighted",
        zero_division=0
    )

    try:
        roc_auc = roc_auc_score(
            y_test,
            probabilities,
            multi_class="ovr",
            average="macro"
        )
    except Exception:
        roc_auc = 0.0


    print()
    print("Accuracy:")
    print(f"{accuracy:.4f}")

    print()
    print("Macro Precision:")
    print(f"{precision:.4f}")

    print()
    print("Macro Recall:")
    print(f"{recall:.4f}")

    print()
    print("Macro F1:")
    print(f"{macro_f1:.4f}")

    print()
    print("Weighted F1:")
    print(f"{weighted_f1:.4f}")

    print()
    print("ROC-AUC:")
    print(f"{roc_auc:.4f}")


    print()
    print("Classification Report:")

    print(
        classification_report(
            y_test,
            predictions,
            zero_division=0
        )
    )


    print("Confusion Matrix:")

    labels = sorted(
        y.unique()
    )

    cm = confusion_matrix(
        y_test,
        predictions,
        labels=labels
    )

    print(cm)


    results.append({
        "Model": model_name,
        "Accuracy": accuracy,
        "Macro Precision": precision,
        "Macro Recall": recall,
        "Macro F1": macro_f1,
        "Weighted F1": weighted_f1,
        "ROC-AUC": roc_auc
    })


# ============================================================
# MODEL COMPARISON
# ============================================================

comparison = pd.DataFrame(
    results
)

print()
print("=" * 60)
print("MODEL COMPARISON")
print("=" * 60)

print(
    comparison.to_string(
        index=False
    )
)


# ============================================================
# BEST MODEL
# ============================================================

best_model = comparison.sort_values(
    "Macro F1",
    ascending=False
).iloc[0]

print()
print("=" * 60)
print("BEST AUDIO MODEL")
print("=" * 60)

print(
    "Model:",
    best_model["Model"]
)

print(
    "Accuracy:",
    f"{best_model['Accuracy']:.4f}"
)

print(
    "Macro F1:",
    f"{best_model['Macro F1']:.4f}"
)

print(
    "ROC-AUC:",
    f"{best_model['ROC-AUC']:.4f}"
)