"use client";

import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function SecurityForm() {
  const [lastUpdated] = useState("08/11/24");
  const [isGoogleConnected] = useState(true);
  const router = useRouter();

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-2xl font-semibold mb-2">Login & security</h2>

      {/* Password Section */}
      <div className="border-b py-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="font-medium">Password</h3>
            <p className="text-sm text-gray-600">Last updated: {lastUpdated}</p>
          </div>
          <button onClick={() => window.location.href = "/profile?tab=change-password"} className="text-indigo-600 hover:text-indigo-700 font-medium">
            Change password
          </button>
        </div>
      </div>

      {/* Social Accounts Section */}
      <div className="border-b py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-medium">Social accounts</h3>
            <p className="text-sm text-gray-600">Google</p>
          </div>
          <button 
            className={`text-sm font-medium ${
              isGoogleConnected ? "text-red-600 hover:text-red-700" : "text-indigo-600 hover:text-indigo-700"
            }`}
          >
            {isGoogleConnected ? "Disconnect" : "Connect"}
          </button>
        </div>

        <div className="flex items-center gap-3 p-3 border rounded-lg">
          <FaGoogle className="w-5 h-5" />
          <span className="text-sm">Sign in with Google</span>
        </div>
      </div>

      {/* Account Deactivation Section */}
      <div className="py-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="font-medium">Account</h3>
            <p className="text-sm text-gray-600">Deactivate your account</p>
          </div>
          <button className="text-red-600 hover:text-red-700 font-medium">
            Deactivate
          </button>
        </div>
      </div>
    </div>
  );
}