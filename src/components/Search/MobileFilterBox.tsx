import { HOMES } from "../../assets/data/homes";
export const MobileFilterBox = ({
  toggleMobileFilter,
  mobileFilter,
  uniqueLocations,
  cheapest,
  searchCheapest,
  filterSearchMobile = { filterSearchMobile },
  setNewHome,
}) => {
  return (
    <div
      onClick={() => toggleMobileFilter()}
      className={`fixed  inset-0 ${
        mobileFilter ? "block" : "hidden"
      }  bg-[#00000020] sm:hidden`}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="   mt-[80px] shadow-sm flex flex-col items-center p-4 "
      >
        <div className="flex items-center  border-[1px] border-black w-[80%] pl-2 rounded-[10px] overflow-hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>

          <input
            type="text"
            placeholder="Search houses"
            className="border-none outline-none w-[90%]"
          />
        </div>
        <div className="h-[50%] pl-4 mt-4 ">
          <div className="carousel carousel-end h-[100%] gap-3">
            {uniqueLocations.map((item, id) => (
              <div
                key={id}
                onClick={() => {
                  toggleMobileFilter();
                  filterSearchMobile(item);
                }}
                className="carousel-item flex h-[90%] w-[32%] border-[1px] rounded-[10px] overflow-hidden flex-col "
              >
                <div className="h-[70%] overflow-hidden bg-transparent">
                  <img src="/Images/map.png" alt="Drink" />
                </div>
                <p className="text-[#00000080] bg-transparent pl-1">{item}</p>
              </div>
            ))}
            <div
              onClick={() => {
                setNewHome(HOMES);
                toggleMobileFilter();
              }}
              className="carousel-item flex h-[90%] w-[32%] border-[1px] overflow-hidden flex-col "
            >
              <div className="h-[70%] overflow-hidden bg-transparent">
                <img src="Images/map.png" alt="Drink" />
              </div>
              <p className="text-[#00000080] bg-transparent">All</p>
            </div>
          </div>
          <div className="fixed bg-transparent w-[97%] text-[#00000090] justify-between -ml-[20px] -mt-[100px] flex items-center gap-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 bg-transparent"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 bg-transparent"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>
        </div>
        <div className="w-full pl-4 flex items-center pt-4 gap-3">
          <div
            onClick={() => {
              toggleMobileFilter();
              searchCheapest();
            }}
            className="w-16 h-8 border-[1px] border-[#575DFB] rounded-full flex justify-between items-center p-1 overflow-hidden"
          >
            <div
              className={`w-6 h-6 rounded-full  ${
                cheapest ? "bg-transparent" : "bg-[#575DFB]"
              } flex items-center `}
            >
              <p className="text-[#575DFB] text-[14px]">
                {cheapest ? "OFF" : ""}
              </p>
            </div>
            <div
              className={`w-6 h-6 rounded-full  ${
                cheapest ? "bg-[#575DFB]" : "bg-transparent"
              } bg-[#575DFB] flex items-center`}
            >
              <p className="text-[#575DFB] bg-transparent fixed text-[14px] ">
                {cheapest ? "" : "ON"}
              </p>
            </div>
          </div>
          <p className="text-[#00000090] text-[18px]">Cheapest</p>
        </div>
      </div>
    </div>
  );
};
