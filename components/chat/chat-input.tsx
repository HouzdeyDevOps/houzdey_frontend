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
    <div className="px-4 sm:px-6 py-4 lg:py-5 border-t bg-white shadow-sm relative">
      <form onSubmit={onSubmit} className="flex items-center gap-3 lg:gap-4 w-full">
        <div className="flex-1 flex items-center gap-2 lg:gap-3">
          <label className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors">
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              className="hidden"
              onChange={onImageSelect}
              disabled={isUploading || isRecording}
            />
            <ImageIcon
              className={`w-6 h-6 lg:w-7 lg:h-7 ${
                isUploading
                  ? "text-gray-400"
                  : "text-indigo-600 hover:text-indigo-700"
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
            className="w-full px-5 py-3 lg:py-3.5 text-base lg:text-lg bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white disabled:opacity-50 transition-all"
          />
        </div>
        <button
          type="button"
          onClick={newMessage.trim() ? onSubmit : onMicClick}
          disabled={!isConnected}
          className="p-3 lg:p-4 flex items-center justify-center bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
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
