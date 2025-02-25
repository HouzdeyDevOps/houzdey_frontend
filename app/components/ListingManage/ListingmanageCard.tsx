"use client"
import { ChevronLeft, ChevronRight, Dot, EllipsisVertical, Heart, X } from "lucide-react";
import { useState } from "react";
import Map from "./Map";
import UploadImages from "./UploadImages";

interface ListedCardProps {
id: number;
  title: string;
  location: string;
  PropertyId: string;
  images: string[];
}

interface ListingManageCardProps{
  property : ListedCardProps;
  onDelete: (id: number) => void;
}

export default function ListingManageCard({ property, onDelete }: ListingManageCardProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [dropDownOpen , setDropdownOpen ] = useState(false)
    const [openModal , setModalOpen] = useState(false)
    const [propertyTitle , setPropertyTitle] = useState("Furnished bedroom apartment")
    const [propertyPrice , setPropertyprice] = useState("₦ 350,000,000")
    const [Note , setNote] = useState("Hot deal! This beautiful 4-bedroom duplex comes with 5 spacious bathrooms, a fully fitted kitchen, and a private study room. Nestled in a serene part of Lekki Phase 1, it’s close to top-notch schools, shopping centers, and eateries. With ample parking space and 24/7 security, it’s perfect for family living. Don't miss out—book your inspection today")
    const [rooms , setRooms] = useState(1)
    const [bathrooms , setBathrooms] = useState(1)
    const [Street , setStreet ] = useState("Clara Estate, AdeniJones, Ikeka, Lagos.")
    const [Available , setAvailable] = useState(false)
    const [deleteOpen , setDeleteOpen] = useState(false)
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  function onAvailable(){
    setAvailable(true)
    setDropdownOpen(false)
  }

  function offAvailable(){
    setAvailable(false)
    setDropdownOpen(false)
  }


  return (
    <div 
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
        <div 
          className="w-full h-full transition-transform duration-500 ease-out "
          style={{ 
            transform: `translateX(-${currentImageIndex * 100}%)`,
            display: 'flex'
          }}
        >
          {property.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${property.title} - Image ${index + 1}`}
              className="object-cover w-full h-full transition-transform duration-300 flex-shrink-0"
            />
          ))}
        </div>
        
        {/* Navigation Arrows - Only show when there are multiple images */}
        {property.images.length > 1 && isHovered && (
          <>
            <button 
              onClick={previousImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors z-10"
            >
              <ChevronLeft className="w-4 h-4 text-neutral-600" />
            </button>
            
            <button 
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors z-10"
            >
              <ChevronRight className="w-4 h-4 text-neutral-600" />
            </button>
          </>
        )}

        {/* Heart Button */}
        <div className="absolute bottom-2 right-2 px-8  rounded-xl bg-white flex items-center justify-between">
          <p className="text-black font-medium text-base">{Available ? "Available " : "Unavailabe"}</p>
          <Dot className={`${Available ? "text-green-600" : "text-yellow-500" } h-10 w-10`}/>

        </div>

        {/* Image Dots Indicator - Only show when there are multiple images */}
        {property.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {property.images.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
      
      <div className="flex justify-between p-4">
      <div className="">
        <h3 className="font-semibold">{property.title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{property.location}</p>
        <p className="text-gray-600 dark:text-gray-400">{property.PropertyId}</p>
      </div>

      <div className="relative">
        <EllipsisVertical className="cursor-pointer" onClick={() => setDropdownOpen(!dropDownOpen)} />
      {dropDownOpen && (
              <> 
              <div
              className="fixed inset-0 bg-black bg-opacity-25 z-10"
              onClick={() => setDropdownOpen(false)} // Close dropdown when overlay is clicked
              >
              </div>
              <div className="absolute right-0 mt-2 w-[330px] bg-white border rounded-3xl shadow-md z-20">
                <ul className="py-2 px-2 text-gray-700">
                  <li className="px-2 py-2 m-2 hover:bg-gray-100 cursor-pointer rounded-lg font-semibold text-base" onClick={()=>setModalOpen(true)}>Edit listing</li>
                  <li className="px-2 py-2 m-2 hover:bg-gray-100 cursor-pointer rounded-lg pb-5 font-semibold text-base">View details</li>
                  <div className="w-[300px] h-[1px] bg-gray-300 px-2"/>
                  <li className="px-2 py-2 m-2 hover:bg-gray-100 cursor-pointer rounded-lg font-semibold text-base" onClick={onAvailable}>Mark as available</li>
                  <li className="px-2 py-2 m-2 hover:bg-gray-100 cursor-pointer rounded-lg font-semibold text-base" onClick={offAvailable}>Mark as Unavailable</li>
                  <div className="w-[300px] h-[1px] bg-gray-300 px-2 my-4"/>
                  <li className="px-2 py-2 m-2 hover:bg-gray-100 cursor-pointer rounded-lg font-semibold text-base"  onClick={()=>setDeleteOpen(true)}>Delete</li>
                </ul>
              </div>
              </>
            )}
        </div>

        {
          deleteOpen && (
            <div className="fixed inset-0 flex items-end justify-center bg-black bg-opacity-50 z-50  min-w-[680px] min-h-[287px] " onClick={()=>setDeleteOpen(false)}>
               <div className={`bg-white  rounded-3xl shadow-lg relative w-[680px] px-11 `} >
                <div className="flex items-end justify-end pt-11 pl-4 pb-3">
                <button onClick={() => setDeleteOpen(false)}>
                 <X className="w-6 h-6" />
               </button>
                </div>
                <div className="pb-10">
                <h1 className="font-semibold text-3xl pb-4">Delete</h1>
                <p className="text-gray-600 font-normal text-base">This will delete <span className="text-black font-normal text-base"> “Furnished bedroom apartment”</span> from your listings permanently</p>
                </div>
                <div className="flex border-t-2 py-10 px-11 gap-4">
                      <button className="py-3 px-4 bg-gray-400 w-[291px] h-[44px] rounded-lg" onClick={() => setDeleteOpen(false)}>
                        <span className="font-medium text-base">Cancel</span>
                      </button>
                      <button className="py-3 px-4 bg-red-600 w-[291px] h-[44px] rounded-lg" onClick={() => onDelete(property.id)}>
                      <span className="font-medium text-base text-white">Delete</span>
                      </button>
                    </div>
               </div>
            </div>
          )
        }

       
      {/* modal openModal */}
      {
        openModal && (
            <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-50 z-50  min-w-[680px] min-h-[287px] ">
                <div className={`bg-white  rounded-3xl shadow-lg relative w-[680px] px-11 `} >
                    <div className="flex justify-around items-center  py-10 border-b-2">
                        <h1 className="text-indigo-600">Reset</h1>
                        <h3 className="font-bold text-2xl">Edit property Listing</h3>
                        <button className="" onClick={() => setModalOpen(false)}>
                         <X className="w-6 h-6" />
                       </button>
                    </div>

                    {/* Body  */}
                    <div className="px-11 pt-10 overflow-y-auto max-h-[70vh]">
                      <h1 className="font-semibold text-xl mb-8">Furnished bedroom apartment</h1>
                      <div>
                      <div className="flex flex-col mb-7">
                        <label htmlFor="email" className="text-gray-700 font-medium mb-1">
                          Property Title
                        </label>
                        <input
                          type="text"
                          id="text"
                          className="border border-gray-300 rounded-lg px-3 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Furnished bedroom apartment"
                          value={propertyTitle}
                          onChange={(e)=>setPropertyTitle(e.target.value)}
                        />
                    </div>

                    {/* Property type */}
                    <div className="flex flex-col mb-7">
                        <label htmlFor="email" className="text-gray-700 font-medium mb-1">
                          Property type
                        </label>
                         <select className="border border-gray-300 rounded-lg px-3 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option>Apartment</option>
                          </select>
                    </div>

                    {/* Property price */}
                    <div className="flex flex-col mb-7">
                        <label htmlFor="email" className="text-gray-700 font-medium mb-1">
                          Property price
                        </label>
                        <input
                          type="text"
                          id="text"
                          className="border border-gray-300 rounded-lg px-3 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Furnished bedroom apartment"
                          value={propertyPrice}
                          onChange={(e)=>setPropertyprice(e.target.value)}
                        />
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-col mb-7">
                        <label htmlFor="email" className="text-gray-700 font-medium mb-1">
                          Amenities
                        </label>
                         <select className="border border-gray-300 rounded-lg px-3 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option>Air conditioner</option>
                            <option>24/7 Security</option>
                            <option>24/7 Power Supply</option>
                            <option>Air conditioning units</option>
                            <option>Extractor fan</option>
                            <option>Parking space</option>
                            <option>Wardropes</option>
                          </select>
                    </div>

                    <div className="flex flex-col mb-20 ">
                        <label htmlFor="email" className="text-gray-700 font-medium mb-1">
                          Property Description
                        </label>
                        <textarea
                         className="w-full p-2 border rounded-lg"
                          rows={6}
                          value={Note}
                          onChange={(e) => setNote(e.target.value)}
                          placeholder={ "Write your note here..."}
                />
                    </div>

                    <div className="border-b-2 pb-16">
                      <div className="">
                      <h1 className="font-semibold text-base">Number of rooms</h1>
                      <div className="mt-6 flex justify-between">
                        <h1 className="">Bedroom(s)</h1>
                        <div className="flex gap-14">
                         <ChevronLeft onClick={() => setRooms((prev) => Math.max(1, prev - 1))} />
                         <span>{rooms}</span>
                        <ChevronRight  onClick={()=>setRooms(prev=> prev + 1)} />
                        </div>
                      </div>
                      </div>

                      
                      <div className="mt-6 flex justify-between">
                        <h1 className="">Bathroom(s)</h1>
                        <div className="flex gap-14">
                         <ChevronLeft onClick={() => setBathrooms((prev) => Math.max(1, prev - 1))} />
                         <span>{bathrooms}</span>
                        <ChevronRight  onClick={()=>setBathrooms(prev=> prev + 1)} />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col mt-12 mb-3">
                        <label htmlFor="email" className="text-gray-700 font-medium mb-1">
                          Street Adress
                        </label>
                        <input
                          type="text"
                          id="text"
                          className="border border-gray-300 rounded-lg px-3 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Enter Street Adress"
                          value={Street}
                          onChange={(e)=>setStreet(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col mb-7">
                        <label htmlFor="email" className="text-gray-700 font-medium mb-1">
                          LGA
                        </label>
                         <select className="border border-gray-300 rounded-lg px-3 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option>ikeja</option>
                          </select>
                    </div>
                    <div className="flex items-center gap-2">
                    <div className="w-[277px] h-[1px] bg-gray-300"/>
                      <span>Or</span>
                    <div className="w-[277px] h-[1px] bg-gray-300"/>
                    </div>


                    {/* Map */}
                    <div className="border-b mb-10">
                      <Map/>
                    </div>

                    <div>
                      <UploadImages/>
                    </div>

                    </div>
                    </div>

                    {/* Footer */}
                    <div className="flex border-t-2 py-10 px-11 gap-4">
                      <button className="py-3 px-4 bg-gray-400 w-[291px] h-[44px] rounded-lg" onClick={() => setModalOpen(false)}>
                        <span className="font-medium text-base">Discard</span>
                      </button>
                      <button className="py-3 px-4 bg-blue-700 w-[291px] h-[44px] rounded-lg" onClick={() => setModalOpen(false)}>
                      <span className="font-medium text-base text-white">Apply Changes</span>
                      </button>
                    </div>
                </div>
            </div>
        )
      }

      </div>
    </div>
  );
}