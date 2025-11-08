"use client";

import { useState, useEffect } from 'react';
import { UserX, Search, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface BlockedUser {
  id: string;
  name: string;
  email: string;
  profile_picture?: string;
  blocked_at: string;
  reason?: string;
}

export default function BlockedUsers() {
  const { user } = useAuth();
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUnblocking, setIsUnblocking] = useState<string | null>(null);

  // Mock data for now - replace with actual API call
  const mockBlockedUsers: BlockedUser[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      profile_picture: '/assets/images/avatar-placeholder.jpg',
      blocked_at: '2024-01-15T10:30:00Z',
      reason: 'Inappropriate behavior'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      blocked_at: '2024-01-10T14:20:00Z',
      reason: 'Spam messages'
    }
  ];

  useEffect(() => {
    const fetchBlockedUsers = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API call
        // const response = await axios.get('/users/blocked');
        // setBlockedUsers(response.data);
        
        // Using mock data for now
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
        setBlockedUsers(mockBlockedUsers);
      } catch (error) {
        console.error('Error fetching blocked users:', error);
        toast.error('Failed to load blocked users');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchBlockedUsers();
    }
  }, [user]);

  const handleUnblockUser = async (userId: string) => {
    try {
      setIsUnblocking(userId);
      
      // TODO: Replace with actual API call
      // await axios.post(`/users/${userId}/unblock`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setBlockedUsers(prev => prev.filter(user => user.id !== userId));
      toast.success('User unblocked successfully');
    } catch (error) {
      console.error('Error unblocking user:', error);
      toast.error('Failed to unblock user');
    } finally {
      setIsUnblocking(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredUsers = blockedUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Blocked Users</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search blocked users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 w-64"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-2 text-gray-600">Loading blocked users...</span>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <UserX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No users found' : 'No blocked users'}
          </h3>
          <p className="text-gray-600">
            {searchTerm 
              ? 'Try adjusting your search terms.'
              : "You haven't blocked any users yet."
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((blockedUser) => (
            <div key={blockedUser.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {blockedUser.profile_picture ? (
                    <img
                      src={blockedUser.profile_picture}
                      alt={blockedUser.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <UserX className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{blockedUser.name}</h4>
                  <p className="text-sm text-gray-600">{blockedUser.email}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-xs text-gray-500">
                      Blocked on {formatDate(blockedUser.blocked_at)}
                    </p>
                    {blockedUser.reason && (
                      <p className="text-xs text-gray-500">
                        Reason: {blockedUser.reason}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => handleUnblockUser(blockedUser.id)}
                disabled={isUnblocking === blockedUser.id}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUnblocking === blockedUser.id ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span className="text-sm">
                  {isUnblocking === blockedUser.id ? 'Unblocking...' : 'Unblock'}
                </span>
              </button>
            </div>
          ))}
        </div>
      )}

      {filteredUsers.length > 0 && (
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Unblocking a user will allow them to contact you again through messages and property inquiries.
          </p>
        </div>
      )}
    </div>
  );
} 