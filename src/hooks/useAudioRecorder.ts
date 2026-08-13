import { useState, useRef, useCallback, useEffect } from 'react';

export interface UseAudioRecorderReturn {
  isRecording: boolean;
  audioBlob: Blob | null;
  audioUrl: string | null;
  recordingTime: number;
  error: string | null;
  waveformValues: number[];
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  clearAudio: () => void;
  setDirectAudioBlob: (blob: Blob | File) => void;
}

/*
 * Convert a browser-recorded WebM/Opus audio Blob
 * into a real PCM WAV Blob.
 *
 * This is important because the Flask backend expects
 * an audio format that its audio processing library can
 * decode reliably.
 */
async function convertBlobToWav(blob: Blob): Promise<Blob> {
  const arrayBuffer = await blob.arrayBuffer();

  const AudioContextClass =
    window.AudioContext ||
    (
      window as unknown as {
        webkitAudioContext: typeof AudioContext;
      }
    ).webkitAudioContext;

  if (!AudioContextClass) {
    throw new Error(
      'Web Audio API is not supported by this browser.'
    );
  }

  const audioContext = new AudioContextClass();

  try {
    const audioBuffer =
      await audioContext.decodeAudioData(arrayBuffer);

    return audioBufferToWav(audioBuffer);
  } finally {
    if (audioContext.state !== 'closed') {
      await audioContext.close().catch(() => {});
    }
  }
}

/*
 * Convert AudioBuffer PCM data into a standard
 * 16-bit PCM WAV file.
 */
function audioBufferToWav(
  audioBuffer: AudioBuffer
): Blob {
  const numberOfChannels =
    audioBuffer.numberOfChannels;

  const sampleRate =
    audioBuffer.sampleRate;

  const length =
    audioBuffer.length *
    numberOfChannels *
    2;

  const buffer =
    new ArrayBuffer(44 + length);

  const view =
    new DataView(buffer);

  writeString(view, 0, 'RIFF');

  view.setUint32(
    4,
    36 + length,
    true
  );

  writeString(
    view,
    8,
    'WAVE'
  );

  writeString(
    view,
    12,
    'fmt '
  );

  view.setUint32(
    16,
    16,
    true
  );

  view.setUint16(
    20,
    1,
    true
  );

  view.setUint16(
    22,
    numberOfChannels,
    true
  );

  view.setUint32(
    24,
    sampleRate,
    true
  );

  view.setUint32(
    28,
    sampleRate *
      numberOfChannels *
      2,
    true
  );

  view.setUint16(
    32,
    numberOfChannels * 2,
    true
  );

  view.setUint16(
    34,
    16,
    true
  );

  writeString(
    view,
    36,
    'data'
  );

  view.setUint32(
    40,
    length,
    true
  );

  /*
   * Interleave all channels into
   * signed 16-bit PCM.
   */
  const channels: Float32Array[] = [];

  for (
    let channel = 0;
    channel < numberOfChannels;
    channel++
  ) {
    channels.push(
      audioBuffer.getChannelData(channel)
    );
  }

  let offset = 44;

  for (
    let sample = 0;
    sample < audioBuffer.length;
    sample++
  ) {
    for (
      let channel = 0;
      channel < numberOfChannels;
      channel++
    ) {
      let sampleValue =
        channels[channel][sample];

      sampleValue =
        Math.max(
          -1,
          Math.min(1, sampleValue)
        );

      const intValue =
        sampleValue < 0
          ? sampleValue * 0x8000
          : sampleValue * 0x7fff;

      view.setInt16(
        offset,
        intValue,
        true
      );

      offset += 2;
    }
  }

  return new Blob(
    [buffer],
    {
      type: 'audio/wav',
    }
  );
}

function writeString(
  view: DataView,
  offset: number,
  value: string
) {
  for (
    let i = 0;
    i < value.length;
    i++
  ) {
    view.setUint8(
      offset + i,
      value.charCodeAt(i)
    );
  }
}

export function useAudioRecorder(): UseAudioRecorderReturn {
  const [isRecording, setIsRecording] =
    useState(false);

  const [audioBlob, setAudioBlob] =
    useState<Blob | null>(null);

  const [audioUrl, setAudioUrl] =
    useState<string | null>(null);

  const [recordingTime, setRecordingTime] =
    useState(0);

  const [error, setError] =
    useState<string | null>(null);

  const [waveformValues, setWaveformValues] =
    useState<number[]>(
      Array(12).fill(20)
    );

  const mediaRecorderRef =
    useRef<MediaRecorder | null>(null);

  const streamRef =
    useRef<MediaStream | null>(null);

  const audioChunksRef =
    useRef<Blob[]>([]);

  const timerIntervalRef =
    useRef<number | null>(null);

  const animFrameRef =
    useRef<number | null>(null);

  const audioCtxRef =
    useRef<AudioContext | null>(null);

  const analyserRef =
    useRef<AnalyserNode | null>(null);

  /*
   * Stop microphone tracks and
   * clean Web Audio resources.
   */
  const stopTracks = useCallback(() => {
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });

      streamRef.current = null;
    }

    if (
      audioCtxRef.current &&
      audioCtxRef.current.state !== 'closed'
    ) {
      audioCtxRef.current
        .close()
        .catch(() => {});

      audioCtxRef.current = null;
    }

    analyserRef.current = null;

    if (
      animFrameRef.current !== null
    ) {
      cancelAnimationFrame(
        animFrameRef.current
      );

      animFrameRef.current = null;
    }
  }, []);

  /*
   * Start microphone recording.
   */
  const startRecording =
    useCallback(async () => {
      setError(null);

      setAudioBlob(null);

      setRecordingTime(0);

      audioChunksRef.current = [];

      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }

      try {
        if (
          !navigator.mediaDevices ||
          !navigator.mediaDevices
            .getUserMedia
        ) {
          throw new Error(
            'Audio recording is not supported by this browser.'
          );
        }

        const stream =
          await navigator.mediaDevices
            .getUserMedia({
              audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
              },
            });

        streamRef.current = stream;

        /*
         * Live waveform.
         */
        try {
          const AudioContextClass =
            window.AudioContext ||
            (
              window as unknown as {
                webkitAudioContext:
                  typeof AudioContext;
              }
            ).webkitAudioContext;

          if (AudioContextClass) {
            const audioContext =
              new AudioContextClass();

            const source =
              audioContext.createMediaStreamSource(
                stream
              );

            const analyser =
              audioContext.createAnalyser();

            analyser.fftSize = 64;

            analyser.smoothingTimeConstant =
              0.75;

            source.connect(analyser);

            audioCtxRef.current =
              audioContext;

            analyserRef.current =
              analyser;

            const dataArray =
              new Uint8Array(
                analyser.frequencyBinCount
              );

            const updateWaveform =
              () => {
                if (
                  !analyserRef.current
                ) {
                  return;
                }

                analyserRef.current
                  .getByteFrequencyData(
                    dataArray
                  );

                const bars: number[] =
                  [];

                const step =
                  Math.max(
                    1,
                    Math.floor(
                      dataArray.length /
                        12
                    )
                  );

                for (
                  let i = 0;
                  i < 12;
                  i++
                ) {
                  const value =
                    dataArray[
                      i * step
                    ] || 0;

                  const height =
                    Math.max(
                      10,
                      Math.min(
                        95,
                        Math.round(
                          (value / 255) *
                            100
                        )
                      )
                    );

                  bars.push(height);
                }

                setWaveformValues(
                  bars
                );

                animFrameRef.current =
                  requestAnimationFrame(
                    updateWaveform
                  );
              };

            updateWaveform();
          }
        } catch (waveformError) {
          console.warn(
            '[MindPulse Audio] Waveform initialization failed:',
            waveformError
          );
        }

        /*
         * Select browser recording format.
         *
         * WebM/Opus is normally supported
         * by Chrome/Brave/Edge.
         */
        const supportedMimeTypes = [
          'audio/webm;codecs=opus',
          'audio/webm',
          'audio/ogg;codecs=opus',
          'audio/ogg',
          'audio/mp4',
        ];

        let selectedMimeType = '';

        for (
          const mimeType of supportedMimeTypes
        ) {
          if (
            typeof MediaRecorder
              .isTypeSupported ===
              'function' &&
            MediaRecorder.isTypeSupported(
              mimeType
            )
          ) {
            selectedMimeType =
              mimeType;

            break;
          }
        }

        const recorder =
          selectedMimeType
            ? new MediaRecorder(
                stream,
                {
                  mimeType:
                    selectedMimeType,
                }
              )
            : new MediaRecorder(
                stream
              );

        mediaRecorderRef.current =
          recorder;

        recorder.ondataavailable =
          (event: BlobEvent) => {
            if (
              event.data &&
              event.data.size > 0
            ) {
              audioChunksRef.current.push(
                event.data
              );
            }
          };

        recorder.onerror = () => {
          setError(
            'Audio recording failed.'
          );

          setIsRecording(false);
        };

        /*
         * IMPORTANT:
         * When recording stops, convert
         * WebM/Opus -> WAV.
         */
        recorder.onstop = async () => {
          /*
           * Immediately leave recording
           * state so the Stop button
           * disappears.
           */
          setIsRecording(false);

          if (
            timerIntervalRef.current !==
            null
          ) {
            clearInterval(
              timerIntervalRef.current
            );

            timerIntervalRef.current =
              null;
          }

          try {
            const recordedMime =
              recorder.mimeType ||
              selectedMimeType ||
              'audio/webm';

            const recordedBlob =
              new Blob(
                audioChunksRef.current,
                {
                  type: recordedMime,
                }
              );

            if (
              recordedBlob.size === 0
            ) {
              throw new Error(
                'The recorded audio file is empty.'
              );
            }

            console.log(
              '[MindPulse Audio] Browser recording:',
              {
                type:
                  recordedBlob.type,
                size:
                  recordedBlob.size,
              }
            );

            /*
             * Convert to WAV.
             */
            const wavBlob =
              await convertBlobToWav(
                recordedBlob
              );

            if (
              wavBlob.size === 0
            ) {
              throw new Error(
                'WAV conversion produced an empty file.'
              );
            }

            console.log(
              '[MindPulse Audio] WAV conversion successful:',
              {
                type:
                  wavBlob.type,
                size:
                  wavBlob.size,
              }
            );

            const url =
              URL.createObjectURL(
                wavBlob
              );

            setAudioBlob(
              wavBlob
            );

            setAudioUrl(url);

            setError(null);

          } catch (conversionError) {
            console.error(
              '[MindPulse Audio] WAV conversion failed:',
              conversionError
            );

            setAudioBlob(null);
            setAudioUrl(null);

            setError(
              conversionError instanceof
                Error
                ? conversionError.message
                : 'Could not convert the recording to WAV.'
            );
          } finally {
            /*
             * Always clean everything,
             * even if conversion fails.
             */
            setIsRecording(false);

            if (
              timerIntervalRef.current !==
              null
            ) {
              clearInterval(
                timerIntervalRef.current
              );

              timerIntervalRef.current =
                null;
            }

            mediaRecorderRef.current =
              null;

            audioChunksRef.current =
              [];

            stopTracks();
          }
        };

        recorder.start(250);

        setIsRecording(true);

        /*
         * Recording timer.
         */
        const startTime =
          Date.now();

        timerIntervalRef.current =
          window.setInterval(() => {
            const elapsed =
              Math.floor(
                (Date.now() -
                  startTime) /
                  1000
              );

            setRecordingTime(
              elapsed
            );
          }, 500);

      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : 'Could not access microphone.';

        console.error(
          '[MindPulse Audio] Recording error:',
          message
        );

        if (
          err instanceof DOMException &&
          err.name ===
            'NotAllowedError'
        ) {
          setError(
            'Microphone permission was denied. Please allow microphone access and try again.'
          );
        } else if (
          err instanceof DOMException &&
          err.name ===
            'NotFoundError'
        ) {
          setError(
            'No microphone was found on this device.'
          );
        } else {
          setError(message);
        }

        setIsRecording(false);

        stopTracks();
      }
    }, [audioUrl, stopTracks]);

  /*
   * Stop recording.
   */
  const stopRecording =
    useCallback(() => {
      if (
        timerIntervalRef.current !==
        null
      ) {
        clearInterval(
          timerIntervalRef.current
        );

        timerIntervalRef.current =
          null;
      }

      const recorder =
        mediaRecorderRef.current;

      if (
        recorder &&
        recorder.state !==
          'inactive'
      ) {
        /*
         * onstop will handle:
         * WebM -> WAV
         * state reset
         * cleanup
         */
        recorder.stop();
      } else {
        setIsRecording(false);

        stopTracks();
      }
    }, [stopTracks]);

  /*
   * Clear selected audio.
   */
  const clearAudio =
    useCallback(() => {
      if (audioUrl) {
        URL.revokeObjectURL(
          audioUrl
        );
      }

      setAudioBlob(null);

      setAudioUrl(null);

      setRecordingTime(0);

      setError(null);

      setWaveformValues(
        Array(12).fill(20)
      );

      audioChunksRef.current =
        [];

      if (
        timerIntervalRef.current !==
        null
      ) {
        clearInterval(
          timerIntervalRef.current
        );

        timerIntervalRef.current =
          null;
      }

      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !==
          'inactive'
      ) {
        mediaRecorderRef.current.stop();
      }

      mediaRecorderRef.current =
        null;

      setIsRecording(false);

      stopTracks();
    }, [audioUrl, stopTracks]);

  /*
   * Handle uploaded audio.
   *
   * Uploaded files are NOT converted here.
   * WAV files can go directly to Flask.
   *
   * For non-WAV uploads, the backend must
   * support their format.
   */
  const setDirectAudioBlob =
    useCallback(
      (blob: Blob | File) => {
        if (audioUrl) {
          URL.revokeObjectURL(
            audioUrl
          );
        }

        if (
          !blob ||
          blob.size === 0
        ) {
          setError(
            'The selected audio file is empty.'
          );

          return;
        }

        const url =
          URL.createObjectURL(
            blob
          );

        setAudioBlob(blob);

        setAudioUrl(url);

        setError(null);

        setRecordingTime(0);

        setIsRecording(false);
      },
      [audioUrl]
    );

  /*
   * Cleanup when component unmounts.
   */
  useEffect(() => {
    return () => {
      if (
        timerIntervalRef.current !==
        null
      ) {
        clearInterval(
          timerIntervalRef.current
        );
      }

      if (audioUrl) {
        URL.revokeObjectURL(
          audioUrl
        );
      }

      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !==
          'inactive'
      ) {
        try {
          mediaRecorderRef.current.stop();
        } catch {
          // Already stopped.
        }
      }

      stopTracks();
    };
  }, [audioUrl, stopTracks]);

  return {
    isRecording,
    audioBlob,
    audioUrl,
    recordingTime,
    error,
    waveformValues,
    startRecording,
    stopRecording,
    clearAudio,
    setDirectAudioBlob,
  };
}