import { useState } from "react";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authApi } from "@/api/auth";
import { toast } from "sonner";

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

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handlePasswordChange = (value: string) => {
    setFormData({ ...formData, newPassword: value });
    setPasswordStrength({
      hasMinLength: value.length >= 8,
      hasNameEmail: !value.includes("john") && !value.includes("@gmail.com"),
      hasSymbol: /[!@#$%^&*(),.?":{}|<>0-9]/.test(value),
    });
    
    // Clear error when user starts typing
    if (errors.newPassword) {
      setErrors({ ...errors, newPassword: "" });
    }

    // Check if confirm password matches the new password
    if (formData.confirmPassword) {
      if (value !== formData.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: "" }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters long";
    } else if (!passwordStrength.hasSymbol) {
      newErrors.newPassword = "Password must contain a number or symbol";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await authApi.changePassword(formData.currentPassword, formData.newPassword);
      toast.success("Password changed successfully!");
      router.push("/profile?tab=security");
    } catch (error: any) {
      toast.error(error.message || "Failed to change password");
      if (error.message.includes("Current password is incorrect")) {
        setErrors({ currentPassword: "Current password is incorrect" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }

    // Check for password match when changing confirm password
    if (field === "confirmPassword") {
      if (value !== formData.newPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: "" }));
      }
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-8">
        <button onClick={() => router.back()} className="text-gray-600 hover:text-gray-800">
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
              onChange={(e) => handleInputChange("currentPassword", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                errors.currentPassword ? "border-red-500" : ""
              }`}
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
          {errors.currentPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
          )}
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
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                errors.newPassword ? "border-red-500" : ""
              }`}
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
          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
          )}

          <div className="mt-3 space-y-2">
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
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                errors.confirmPassword ? "border-red-500" : ""
              }`}
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
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Changing password..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}