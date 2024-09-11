import { useState } from "react";
import { HOMES } from "../../assets/data/homes";

export const LgaSearch = ({
  location,
  uniqueLocations,
  filterSearch,
  setNewHome,
  setLocation,
  properties,
  setMyProperties,
}) => {
  return (
    <div
      onClick={() => setLocation(!location)}
      className={`${
        location ? "block" : "hidden"
      } fixed inset-0 bg-[#00000070]  -ml-[316px]`}
    >
      <div
        className={` ${
          location ? "block" : "hidden"
        } w-[450px] border-[1px] rounded-[20px] overflow-hidden p-2 shadow-sm ml-[35%] mt-[165px]`}
      >
        <p className="text-[#000000] bold mt-2 pl-4">Search by Location</p>
        <div className="flex flex-wrap items-center justify-center mt-4 gap-2">
          {uniqueLocations.map((items, id) => (
            <div key={id} className="mt-3">
              <button
                value={"New Haven, Enugu"}
                onClick={() => filterSearch(items)}
                className="p-1 rounded-[10px] hover:bg-[#00000015] "
              >
                <div className="w-[120px] h-[120px] overflow-hidden border-[1px]  rounded-[10px]">
                  <img src="/Images/map.png" className=" h-[180px]" />
                </div>
                <p className="text-[#00000090] bg-transparent">{items}</p>
              </button>
            </div>
          ))}
          <div className="mt-3">
            <button
              value={"New Haven, Enugu"}
              onClick={() => {
                setMyProperties(properties);
                setLocation(!location);
              }}
              className="p-1 rounded-[10px] hover:bg-[#00000015] "
            >
              <div className="w-[120px] h-[120px] overflow-hidden border-[1px]  rounded-[10px]">
                <img src="/public/Images/map.png" className=" h-[180px]" />
              </div>
              <p className="text-[#00000090] bg-transparent ">All</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
