import { useState } from "react";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function  ChangePassword() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasNameEmail: true,
    hasSymbol: false,
  });

  const handlePasswordChange = (value: string) => {
    setFormData({ ...formData, newPassword: value });
    setPasswordStrength({
      hasMinLength: value.length >= 8,
      hasNameEmail: !value.includes("john") && !value.includes("@gmail.com"),
      hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/profile?tab=security");
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-8">
        <button onClick={() => router.back()} className="text-gray-600">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold">Change password</h2>
      </div>

      <p className="text-gray-600 mb-6">
        By changing your password, all your active Houzdey sessions on other devices and browsers will be signed out, except for this session. However, the one application linked to your account will retain its access, as it is not affected by password changes
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 mb-2">Current password</label>
          <div className="relative">
            <input
              type={showPasswords.current ? "text" : "password"}
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />
            <button
              type="button"
              onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPasswords.current ? (
                <EyeOff className="w-5 h-5 text-gray-500" />
              ) : (
                <Eye className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </div>
          <Link href="/forgot-password" className="text-indigo-600 text-sm hover:underline mt-1 inline-block">
            Forgot password?
          </Link>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">New password</label>
          <div className="relative">
            <input
              type={showPasswords.new ? "text" : "password"}
              value={formData.newPassword}
              onChange={(e) => handlePasswordChange(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />
            <button
              type="button"
              onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPasswords.new ? (
                <EyeOff className="w-5 h-5 text-gray-500" />
              ) : (
                <Eye className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </div>

          <div className="mt-2 space-y-1">
            <p className="text-sm text-gray-600">Password strength:</p>
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                passwordStrength.hasMinLength ? "border-green-500 bg-green-50" : "border-gray-300"
              }`}>
                {passwordStrength.hasMinLength && (
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                )}
              </div>
              <span className="text-sm text-gray-600">At least 8 characters</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                passwordStrength.hasNameEmail ? "border-green-500 bg-green-50" : "border-gray-300"
              }`}>
                {passwordStrength.hasNameEmail && (
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                )}
              </div>
              <span className="text-sm text-gray-600">Cannot contain your email address or name</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                passwordStrength.hasSymbol ? "border-green-500 bg-green-50" : "border-gray-300"
              }`}>
                {passwordStrength.hasSymbol && (
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                )}
              </div>
              <span className="text-sm text-gray-600">Contains a number or symbol</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Confirm password</label>
          <div className="relative">
            <input
              type={showPasswords.confirm ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />
            <button
              type="button"
              onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPasswords.confirm ? (
                <EyeOff className="w-5 h-5 text-gray-500" />
              ) : (
                <Eye className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}