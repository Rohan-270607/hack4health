import numpy as np


# ============================================================
# STRESS LEVELS
# ============================================================

STRESS_LEVELS = [
    "Healthy",
    "Mild Stress",
    "Moderate Stress",
    "Severe Stress"
]


# ============================================================
# FACIAL EMOTION → STRESS MAPPING
# Based on the supplied dataset description
# ============================================================

FACE_EMOTIONS = [
    "Angry",
    "Disgust",
    "Fear",
    "Happy",
    "Sad",
    "Surprise",
    "Neutral"
]

FACE_TO_STRESS = {
    "Angry": "Severe Stress",
    "Disgust": "Moderate Stress",
    "Fear": "Moderate Stress",
    "Happy": "Healthy",
    "Sad": "Mild Stress",
    "Surprise": "Mild Stress",
    "Neutral": "Healthy"
}


# ============================================================
# AUDIO EMOTION → STRESS MAPPING
# Based on the supplied dataset description
# ============================================================

AUDIO_EMOTIONS = [
    "Neutral",
    "Calm",
    "Happy",
    "Sad",
    "Angry",
    "Fear",
    "Disgust",
    "Surprise"
]

AUDIO_TO_STRESS = {
    "Neutral": "Healthy",
    "Calm": "Healthy",
    "Happy": "Healthy",
    "Sad": "Mild Stress",
    "Surprise": "Mild Stress",
    "Fear": "Moderate Stress",
    "Angry": "Moderate Stress",
    "Disgust": "Severe Stress"
}


# ============================================================
# CONVERT EMOTION PROBABILITIES → STRESS PROBABILITIES
# ============================================================

def emotion_to_stress(
    probabilities,
    emotions,
    mapping
):

    stress_probabilities = {
        level: 0.0
        for level in STRESS_LEVELS
    }

    for emotion, probability in zip(
        emotions,
        probabilities
    ):

        stress_level = mapping.get(
            emotion
        )

        if stress_level is not None:

            stress_probabilities[
                stress_level
            ] += probability

    values = np.array([
        stress_probabilities[level]
        for level in STRESS_LEVELS
    ])

    total = values.sum()

    if total > 0:
        values = values / total

    return values


# ============================================================
# FUSION
# ============================================================

def fuse_predictions(
    face_probabilities,
    audio_probabilities,
    numerical_probabilities,
    face_weight=0.25,
    audio_weight=0.25,
    numerical_weight=0.50
):

    # Convert facial emotion probabilities
    face_stress = emotion_to_stress(
        face_probabilities,
        FACE_EMOTIONS,
        FACE_TO_STRESS
    )

    # Convert audio emotion probabilities
    audio_stress = emotion_to_stress(
        audio_probabilities,
        AUDIO_EMOTIONS,
        AUDIO_TO_STRESS
    )

    # Numerical model already predicts stress classes
    numerical_stress = np.array(
        numerical_probabilities,
        dtype=float
    )

    numerical_stress = (
        numerical_stress /
        numerical_stress.sum()
    )

    # --------------------------------------------------------
    # WEIGHTED LATE FUSION
    # --------------------------------------------------------

    fused = (
        face_weight * face_stress
        +
        audio_weight * audio_stress
        +
        numerical_weight * numerical_stress
    )

    fused = fused / fused.sum()

    prediction_index = np.argmax(
        fused
    )

    prediction = STRESS_LEVELS[
        prediction_index
    ]

    confidence = fused[
        prediction_index
    ]

    return {
        "prediction": prediction,
        "confidence": float(confidence),
        "probabilities": {
            level: float(probability)
            for level, probability
            in zip(
                STRESS_LEVELS,
                fused
            )
        },
        "face_stress": {
            level: float(probability)
            for level, probability
            in zip(
                STRESS_LEVELS,
                face_stress
            )
        },
        "audio_stress": {
            level: float(probability)
            for level, probability
            in zip(
                STRESS_LEVELS,
                audio_stress
            )
        },
        "numerical_stress": {
            level: float(probability)
            for level, probability
            in zip(
                STRESS_LEVELS,
                numerical_stress
            )
        }
    }


# ============================================================
# DEMO
# ============================================================

if __name__ == "__main__":

    # Example facial probabilities
    face = [
        0.05,   # Angry
        0.03,   # Disgust
        0.08,   # Fear
        0.04,   # Happy
        0.55,   # Sad
        0.02,   # Surprise
        0.23    # Neutral
    ]

    # Example audio probabilities
    audio = [
        0.05,   # Neutral
        0.04,   # Calm
        0.02,   # Happy
        0.35,   # Sad
        0.20,   # Angry
        0.15,   # Fear
        0.10,   # Disgust
        0.09    # Surprise
    ]

    # Example numerical model probabilities
    numerical = [
        0.10,   # Healthy
        0.20,   # Mild Stress
        0.55,   # Moderate Stress
        0.15    # Severe Stress
    ]

    result = fuse_predictions(
        face,
        audio,
        numerical
    )

    print()
    print("=" * 60)
    print("MULTIMODAL FUSION")
    print("=" * 60)

    print()
    print(
        "Final Assessment:",
        result["prediction"]
    )

    print(
        "Confidence:",
        f"{result['confidence']:.2%}"
    )

    print()
    print("Final Probabilities:")

    for level, probability in result[
        "probabilities"
    ].items():

        print(
            f"{level:<18}"
            f"{probability:.2%}"
        )

    print()
    print("Facial Stress Evidence:")

    for level, probability in result[
        "face_stress"
    ].items():

        print(
            f"{level:<18}"
            f"{probability:.2%}"
        )

    print()
    print("Audio Stress Evidence:")

    for level, probability in result[
        "audio_stress"
    ].items():

        print(
            f"{level:<18}"
            f"{probability:.2%}"
        )

    print()
    print("Numerical Stress Evidence:")

    for level, probability in result[
        "numerical_stress"
    ].items():

        print(
            f"{level:<18}"
            f"{probability:.2%}"
        )