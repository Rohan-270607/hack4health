import os
import numpy as np
import pandas as pd
import librosa
from concurrent.futures import ProcessPoolExecutor, as_completed

AUDIO_ROOT = os.path.join("audio data", "Audios")
OUTPUT_FILE = "audio_features.csv"
CHECKPOINT_FILE = "audio_checkpoint.csv"

MAX_WORKERS = max(1, (os.cpu_count() or 4) - 2)
CHECKPOINT_INTERVAL = 100

emotion_mapping = {
    "01": "Neutral",
    "02": "Calm",
    "03": "Happy",
    "04": "Sad",
    "05": "Angry",
    "06": "Fear",
    "07": "Disgust",
    "08": "Surprise"
}

def extract_features(audio_path):
    filename = os.path.basename(audio_path)
    parts = filename.replace(".wav", "").split("-")

    emotion_code = parts[2]
    intensity_code = parts[3]
    statement_code = parts[4]
    repetition_code = parts[5]
    actor_id = parts[6]

    emotion = emotion_mapping.get(
        emotion_code,
        "Unknown"
    )

    y, sr = librosa.load(
        audio_path,
        sr=None
    )

    duration = len(y) / sr

    mfcc = librosa.feature.mfcc(
        y=y,
        sr=sr,
        n_mfcc=13
    )

    mfcc_mean = np.mean(
        mfcc,
        axis=1
    )

    mfcc_variance = np.var(
        mfcc,
        axis=1
    )

    pitch, _, _ = librosa.pyin(
        y,
        fmin=50,
        fmax=500
    )

    pitch_values = pitch[
        ~np.isnan(pitch)
    ]

    if len(pitch_values) > 0:
        pitch_mean = float(np.mean(pitch_values))
        pitch_std = float(np.std(pitch_values))
    else:
        pitch_mean = 0.0
        pitch_std = 0.0

    rms = librosa.feature.rms(
        y=y
    )

    speech_energy = float(
        np.mean(rms)
    )

    energy_variance = float(
        np.var(rms)
    )

    zcr = librosa.feature.zero_crossing_rate(
        y
    )

    zero_crossing_rate = float(
        np.mean(zcr)
    )

    result = {
        "filepath": audio_path,
        "filename": filename,
        "actor_id": int(actor_id),
        "emotion": emotion,
        "emotion_code": int(emotion_code),
        "intensity_code": int(intensity_code),
        "statement_code": int(statement_code),
        "repetition_code": int(repetition_code),
        "sample_rate": sr,
        "duration": duration,
        "pitch_mean": pitch_mean,
        "pitch_std": pitch_std,
        "speech_energy": speech_energy,
        "energy_variance": energy_variance,
        "zero_crossing_rate": zero_crossing_rate
    }

    for j in range(13):
        result[
            f"mfcc_{j + 1}_mean"
        ] = float(mfcc_mean[j])

    for j in range(13):
        result[
            f"mfcc_{j + 1}_variance"
        ] = float(mfcc_variance[j])

    return result

if __name__ == "__main__":

    files = []

    for root, _, filenames in os.walk(AUDIO_ROOT):
        for file in filenames:
            if file.lower().endswith(".wav"):
                files.append(
                    os.path.join(root, file)
                )

    files.sort()

    print(f"Total audio files: {len(files)}")
    print(f"Using {MAX_WORKERS} CPU workers")

    if os.path.exists(CHECKPOINT_FILE):
        df_existing = pd.read_csv(
            CHECKPOINT_FILE
        )

        processed_files = set(
            df_existing["filepath"].astype(str)
        )

        results = df_existing.to_dict(
            "records"
        )

        print(
            f"Resuming from {len(results)} processed files"
        )

    else:
        processed_files = set()
        results = []

        print(
            "Starting from beginning"
        )

    remaining_files = [
        f for f in files
        if f not in processed_files
    ]

    print(
        f"Remaining files: {len(remaining_files)}"
    )

    completed_since_checkpoint = 0

    with ProcessPoolExecutor(
        max_workers=MAX_WORKERS
    ) as executor:

        futures = {
            executor.submit(
                extract_features,
                path
            ): path
            for path in remaining_files
        }

        for completed, future in enumerate(
            as_completed(futures),
            1
        ):

            audio_path = futures[future]

            try:
                result = future.result()

                results.append(result)

                processed_files.add(
                    audio_path
                )

                total_completed = len(
                    processed_files
                )

                completed_since_checkpoint += 1

                print(
                    f"Processed {total_completed}/{len(files)}"
                )

                if (
                    completed_since_checkpoint
                    >= CHECKPOINT_INTERVAL
                ):

                    checkpoint_df = pd.DataFrame(
                        results
                    )

                    checkpoint_df.to_csv(
                        CHECKPOINT_FILE,
                        index=False
                    )

                    print(
                        f"Checkpoint saved: {len(results)} files"
                    )

                    completed_since_checkpoint = 0

            except Exception as e:

                print(
                    f"Error processing {audio_path}: {e}"
                )

    final_df = pd.DataFrame(results)

    final_df.to_csv(
        OUTPUT_FILE,
        index=False
    )

    print()
    print("Processing complete.")
    print(
        f"Total processed: {len(final_df)}"
    )
    print(
        f"Features: {len(final_df.columns)}"
    )
    print(
        f"Saved to: {OUTPUT_FILE}"
    )

    print()
    print("Emotion Distribution:")
    print(
        final_df["emotion"].value_counts()
    )

    if os.path.exists(CHECKPOINT_FILE):
        os.remove(CHECKPOINT_FILE)