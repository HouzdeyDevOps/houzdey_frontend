import ConversationList from "@/components/chat/conversation-list";

export default function ChatPage() {
  return (
    <div className="flex h-screen">
      {/* Sidebar with conversation list */}
      <div className="w-[320px] border-r bg-white">
        <div className="p-4 border-b">
          <h1 className="text-xl font-semibold">Messages</h1>
        </div>
        <ConversationList />
      </div>

      {/* Welcome message when no conversation is selected */}
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Welcome to Messages</h2>
          <p className="text-gray-600">Select a conversation to start chatting</p>
        </div>
      </div>
    </div>
  );
} 