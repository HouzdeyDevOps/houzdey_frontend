import { Send, Mic, Image as ImageIcon, StopCircle } from "lucide-react";

interface ChatInputProps {
  newMessage: string;
  isRecording: boolean;
  recordingTime: number;
  isConnected: boolean;
  isUploading: boolean;
  onMessageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMicClick: () => void;
  formatRecordingTime: (seconds: number) => string;
}

export default function ChatInput({
  newMessage,
  isRecording,
  recordingTime,
  isConnected,
  isUploading,
  onMessageChange,
  onSubmit,
  onImageSelect,
  onMicClick,
  formatRecordingTime
}: ChatInputProps) {
  return (
    <div className="p-4 border-t bg-white relative">
      <form onSubmit={onSubmit} className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2">
          <label className="cursor-pointer">
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              className="hidden"
              onChange={onImageSelect}
              disabled={isUploading || isRecording}
            />
            <ImageIcon
              className={`w-6 h-6 ${
                isUploading
                  ? "text-gray-400"
                  : "text-blue-500 hover:text-blue-600"
              }`}
            />
          </label>
          <input
            type="text"
            value={newMessage}
            onChange={onMessageChange}
            placeholder={
              isRecording ? "Recording..." : "Are you open to negotiations?"
            }
            disabled={isRecording}
            className="w-full px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white disabled:opacity-50"
          />
        </div>
        <button
          type="button"
          onClick={newMessage.trim() ? onSubmit : onMicClick}
          disabled={!isConnected}
          className="p-2 flex bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRecording ? (
            <>
              <StopCircle className="w-6 h-6" />
              <span className="ml-2">
                {formatRecordingTime(recordingTime)}
              </span>
            </>
          ) : newMessage.trim() ? (
            <Send />
          ) : (
            <Mic />
          )}
        </button>
      </form>
    </div>
  );
}
