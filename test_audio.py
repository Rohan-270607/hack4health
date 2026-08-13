import requests
import os


# ============================================================
# AUDIO FILE TO TEST
# ============================================================

AUDIO_PATH = r"D:\Projects\H4H\audio data\Audios\Actor_01\03-01-01-01-01-01-01.wav"


# ============================================================
# CHECK FILE
# ============================================================

if not os.path.exists(AUDIO_PATH):

    print("ERROR: Audio file not found.")
    print(AUDIO_PATH)
    exit()


print("Testing audio:")
print(AUDIO_PATH)


# ============================================================
# SEND AUDIO TO FLASK
# ============================================================

try:

    with open(AUDIO_PATH, "rb") as audio:

        response = requests.post(
            "http://127.0.0.1:5000/api/analyze/audio",
            files={
                "audio": (
                    os.path.basename(AUDIO_PATH),
                    audio,
                    "audio/wav"
                )
            }
        )


    # ========================================================
    # PRINT RESULT
    # ========================================================

    print()
    print("=" * 60)
    print("AUDIO API TEST")
    print("=" * 60)

    print()
    print("Status Code:", response.status_code)

    print()
    print("Response:")

    try:

        result = response.json()

        print(result)

    except Exception:

        print(response.text)


except requests.exceptions.ConnectionError:

    print()
    print("ERROR: Could not connect to Flask.")

    print(
        "Make sure app.py is running on port 5000."
    )

except Exception as e:

    print()
    print("ERROR:")
    print(e)