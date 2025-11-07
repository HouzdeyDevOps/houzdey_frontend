import { useState, useRef, useCallback } from 'react';
import { uploadService } from '@/services/upload';

interface UseVoiceRecordingProps {
  conversationId: string | null;
  onSendVoice: (fileUrl: string, duration: number) => Promise<void>;
}

export function useVoiceRecording({ conversationId, onSendVoice }: UseVoiceRecordingProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(async () => {
    try {
      setRecordingError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
      setRecordingTime(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 300) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Failed to start recording:", error);
      setRecordingError(
        "Failed to start recording. Please check your microphone permissions."
      );
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (!mediaRecorderRef.current || !conversationId) return;

    try {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        setIsUploading(true);
        try {
          const fileUrl = await uploadService.uploadFile(
            new File([audioBlob], "voice-message.webm", { type: "audio/webm" }),
            "voice"
          );
          await onSendVoice(fileUrl, recordingTime);
        } catch (error) {
          console.error("Failed to upload voice message:", error);
          setRecordingError(
            error instanceof Error
              ? error.message
              : "Failed to upload voice message. Please try again."
          );
        } finally {
          setIsUploading(false);
        }
      };

      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    } catch (error) {
      console.error("Failed to stop recording:", error);
      setRecordingError("Failed to stop recording. Please try again.");
      setIsRecording(false);
    }
  }, [conversationId, recordingTime, onSendVoice]);

  const formatRecordingTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }, []);

  return {
    isRecording,
    recordingTime,
    recordingError,
    isUploading,
    startRecording,
    stopRecording,
    formatRecordingTime
  };
}
