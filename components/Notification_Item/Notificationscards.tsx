"use client";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";

interface Item {
  id: number;
  title: string;
  description: string;
  time: string;
  image: string;
}

interface NotificationcardsProps {
  item: Item;
  notificationOn: boolean;
  setNotificationOn: React.Dispatch<React.SetStateAction<boolean>>; // Correct type
}

export default function Notificationcards({
  item,
  notificationOn,
  setNotificationOn,
}: NotificationcardsProps) {
  const [dropDownOpen, setDropdownOpen] = useState<boolean>(false);

  return (
    <div className="border-b flex justify-between items-center">
      <div>
        <ul className="list-disc pl-5">
          <li className="list-item marker:text-blue-500">
            <div className="gap-3 p-3">
              <p className="font-semibold text-xl">{item.title}</p>
              <p className="pt-3 font-normal">{item.description}</p>
              <p className="font-light text-sm text-gray-500 p-4">{item.time}</p>
            </div>
          </li>
        </ul>
      </div>
      <div className="flex gap-3">
        <img alt="New Listing" src={item.image} width={57} height={52.68} />
        <div className="relative">
          <EllipsisVertical
            className="cursor-pointer"
            onClick={() => setDropdownOpen(!dropDownOpen)}
          />
          {dropDownOpen && (
            <>
              {/* Overlay */}
              <div
                className="fixed inset-0 bg-black bg-opacity-25 z-10"
                onClick={() => setDropdownOpen(false)} // Close dropdown when overlay is clicked
              ></div>
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-52 bg-white border rounded-3xl shadow-md z-20">
                <ul className="py-2 text-gray-700">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Delete
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => setNotificationOn((prev) => !prev)} 
                  >
                    {notificationOn ? "Turn off notifications" : "Turn on notifications"}
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
