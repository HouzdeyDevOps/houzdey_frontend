"use client";

import { useState, useEffect } from "react";
import { FaGoogle, FaFacebook, FaApple } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { authApi } from "@/api/auth";
import { toast } from "sonner";
import { Eye, EyeOff, X, AlertTriangle } from "lucide-react";

interface SocialAccount {
  provider: string;
  icon: React.ReactNode;
  name: string;
  connected: boolean;
}

export default function SecurityForm() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  
  // Modal states
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const [deactivatePassword, setDeactivatePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userData = await authApi.getCurrentUser();
      setUser(userData);
      
      // Set up social accounts based on user data
      setSocialAccounts([
        {
          provider: "google",
          icon: <FaGoogle className="w-5 h-5" />,
          name: "Google",
          connected: !!userData.google_id,
        },
        {
          provider: "facebook",
          icon: <FaFacebook className="w-5 h-5" />,
          name: "Facebook",
          connected: !!userData.facebook_id,
        },
        {
          provider: "apple",
          icon: <FaApple className="w-5 h-5" />,
          name: "Apple",
          connected: !!userData.apple_id,
        },
      ]);
    } catch (error) {
      toast.error("Failed to load user data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnectSocial = (provider: string) => {
    setSelectedProvider(provider);
    setShowDisconnectModal(true);
  };

  const confirmDisconnectSocial = async () => {
    setActionLoading(true);
    try {
      await authApi.disconnectSocialAccount(selectedProvider);
      toast.success(`${selectedProvider.charAt(0).toUpperCase() + selectedProvider.slice(1)} account disconnected successfully`);
      
      // Update local state
      setSocialAccounts(prev => 
        prev.map(account => 
          account.provider === selectedProvider 
            ? { ...account, connected: false }
            : account
        )
      );
      
      setShowDisconnectModal(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to disconnect account");
    } finally {
      setActionLoading(false);
      setSelectedProvider("");
    }
  };

  const handleDeactivateAccount = async () => {
    if (!deactivatePassword.trim()) {
      toast.error("Please enter your password");
      return;
    }

    setActionLoading(true);
    try {
      await authApi.deactivateAccount(deactivatePassword);
      toast.success("Account deactivated successfully");
      
      // Clear local storage and redirect to home
      localStorage.removeItem("token");
      router.push("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to deactivate account");
    } finally {
      setActionLoading(false);
    }
  };

  const getLastPasswordUpdate = () => {
    if (user?.updated_at) {
      return new Date(user.updated_at).toLocaleDateString('en-GB');
    }
    return "Not available";
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-2xl font-semibold mb-6">Login & security</h2>

      {/* Password Section */}
      <div className="border-b py-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="font-medium">Password</h3>
            <p className="text-sm text-gray-600">Last updated: {getLastPasswordUpdate()}</p>
          </div>
          <button 
            onClick={() => router.push("/profile?tab=change-password")} 
            className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
          >
            Change password
          </button>
        </div>
      </div>

      {/* Social Accounts Section */}
      <div className="border-b py-6">
        <div className="mb-4">
          <h3 className="font-medium mb-2">Social accounts</h3>
          <p className="text-sm text-gray-600">Manage your connected social media accounts</p>
        </div>

        <div className="space-y-3">
          {socialAccounts.map((account) => (
            <div key={account.provider} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {account.icon}
                <div>
                  <span className="text-sm font-medium">{account.name}</span>
                  <p className="text-xs text-gray-500">
                    {account.connected ? "Connected" : "Not connected"}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => account.connected ? handleDisconnectSocial(account.provider) : null}
                className={`text-sm font-medium transition-colors ${
                  account.connected 
                    ? "text-red-600 hover:text-red-700 cursor-pointer" 
                    : "text-gray-400 cursor-not-allowed"
                }`}
                disabled={!account.connected}
              >
                {account.connected ? "Disconnect" : "Connect"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Account Deactivation Section */}
      <div className="py-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="font-medium">Account</h3>
            <p className="text-sm text-gray-600">Permanently deactivate your account</p>
          </div>
          <button 
            onClick={() => setShowDeactivateModal(true)}
            className="text-red-600 hover:text-red-700 font-medium transition-colors"
          >
            Deactivate
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          This action cannot be undone. Your account and all associated data will be permanently removed.
        </p>
      </div>

      {/* Disconnect Social Account Modal */}
      {showDisconnectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Disconnect {selectedProvider.charAt(0).toUpperCase() + selectedProvider.slice(1)}</h3>
              <button 
                onClick={() => setShowDisconnectModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <span className="font-medium">Are you sure?</span>
              </div>
              <p className="text-sm text-gray-600">
                You will no longer be able to sign in using your {selectedProvider} account. 
                Make sure you have a password set for your account.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDisconnectModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={confirmDisconnectSocial}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                disabled={actionLoading}
              >
                {actionLoading ? "Disconnecting..." : "Disconnect"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Account Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-red-600">Deactivate Account</h3>
              <button 
                onClick={() => {
                  setShowDeactivateModal(false);
                  setDeactivatePassword("");
                  setShowPassword(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span className="font-medium text-red-600">This action cannot be undone</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Your account and all associated data including properties, messages, and reviews will be permanently deleted.
              </p>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your password to confirm
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={deactivatePassword}
                    onChange={(e) => setDeactivatePassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeactivateModal(false);
                  setDeactivatePassword("");
                  setShowPassword(false);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDeactivateAccount}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                disabled={actionLoading || !deactivatePassword.trim()}
              >
                {actionLoading ? "Deactivating..." : "Deactivate Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}