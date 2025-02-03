 "use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { PersonalInfoData } from "@/@types/auth";
import { PersonalInfoModalProps } from "@/@types/auth";


export default function PersonalInfoModal({
  isOpen,
  onClose,
  onBack,
  onSubmit,
}: PersonalInfoModalProps) {
  const [formData, setFormData] = useState<PersonalInfoData>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    dateOfBirth: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-lg mx-4 p-6">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-semibold">Personal Information</h2>
          <div className="w-9" /> {/* Spacer for alignment */}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">First name</label>
              <input
                type="text"
                placeholder="Enter first name"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Last name</label>
              <input
                type="text"
                placeholder="Enter last name"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Phone number</label>
            <input
              type="tel"
              placeholder="Enter phone number"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Date of birth</label>
            <input
              type="date"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              value={formData.dateOfBirth}
              onChange={(e) =>
                setFormData({ ...formData, dateOfBirth: e.target.value })
              }
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}