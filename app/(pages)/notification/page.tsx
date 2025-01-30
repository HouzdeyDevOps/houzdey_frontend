"use client";
import { ChevronLeft, EllipsisVertical } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {Notificationsdata } from "@/app/components/Notification_Item/Notifications"
import NotificationsCard from "@/app/components/Notification_Item/Notificationscards"



export default function Notifications() {
  
  const [dropDownOpen, setDropdownOpen] = React.useState<boolean>(false); // State explicitly typed
  const [notificationOn , setNotificationOn] = React.useState<boolean>(false)

  return (
    <main className="relative h-screen">
      <header className="p-4 border-b">
        <nav className="max-7xl mx-auto flex items-center justify-between">
          <Link href="/">
            <Image
              src="/assets/images/houzdey-logo.png"
              alt="Houzdey"
              width={180}
              height={180}
            />
          </Link>
          <Image
            src="/assets/images/Face _37.png"
            alt="profile_Image"
            className="rounded-full"
            width={48}
            height={48}
          />
        </nav>
      </header>

      {/* Title */}
      <div className="flex justify-between py-8 px-4 mt-6 items-center cursor-pointer">
        <div className="flex h-9 text-3xl items-center text-center gap-6">
          <ChevronLeft className="w-6 h-6 font-bold" />
          <h1 className="font-semibold text-gray-800">Notifications</h1>
        </div>
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
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" 
                  onClick={()=>setNotificationOn(prev => !prev)}
                  >
                   { notificationOn ? "Turn on notifications" : "Turn off notifications"}
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Clear all notifications
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Notification Components */}
      <div>
        {notificationOn || Notificationsdata.length === 0 ? (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <h1 className="font-semibold text-4xl py-6">
             { notificationOn ?  "No notification yet" : "Notifications are turned off"} 
            </h1>
            <p className="font-semibold text-gray-600 text-2xl">
              {notificationOn ? " You currently have no Notification" : "You will not receive notifications until they are enabled"}
            </p>
          </div>
        ) : (
          <div className="p-4 cursor-pointer">
          {
            (Notificationsdata ?? [])?.map((item : any)=>(
               <NotificationsCard key={item.id} item ={item} 
               notificationOn ={notificationOn} 
               setNotificationOn={setNotificationOn}/>
            ))
          }
        </div>
        )}
      </div>
 
    </main>
  );
}
