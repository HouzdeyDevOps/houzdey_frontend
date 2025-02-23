
import React from 'react'

const ChatHeaderSkeleton = () => {
  return (
    // Skeleton loading for chat header
    <div className="px-4 py-3 border-b flex items-center z-10 bg-white">
    <div className="flex-1 flex items-center">
      <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse mr-3" />
      <div className="flex-1">
        <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mb-2" />
        <div className="h-3 w-32 bg-gray-200 animate-pulse rounded" />
      </div>
    </div>
    <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full" />
  </div>
  )
}

export default ChatHeaderSkeleton
