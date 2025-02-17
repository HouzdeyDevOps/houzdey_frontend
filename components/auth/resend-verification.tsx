import { useState } from 'react';
import { authApi } from '@/api/auth';
import { Mail } from 'lucide-react';

interface ResendVerificationProps {
  email: string;
  onClose: () => void;
}

export default function ResendVerification({ email, onClose }: ResendVerificationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleResend = async () => {
    try {
      setIsLoading(true);
      setError('');
      await authApi.resendVerificationEmail(email);
      setSuccess(true);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
      <div className="text-center mb-6">
        <Mail className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold">Verify Your Email</h2>
        <p className="text-gray-600 mt-2">
          Please verify your email address to continue. Check your inbox for the verification link.
        </p>
      </div>

      {success ? (
        <div className="text-green-600 text-center mb-4">
          Verification email sent successfully!
        </div>
      ) : error ? (
        <div className="text-red-600 text-center mb-4">{error}</div>
      ) : null}

      <div className="space-y-4">
        <button
          onClick={handleResend}
          disabled={isLoading || success}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {isLoading ? 'Sending...' : 'Resend Verification Email'}
        </button>
        <button
          onClick={onClose}
          className="w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
        >
          Close
        </button>
      </div>
    </div>
  );
} 