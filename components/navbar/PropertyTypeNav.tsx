import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "@/store/slices/propertySlice";
import { RootState } from "@/store/store";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { PropertyType, PropertyTypeArray } from "@/@types/create-listing";
import { ChevronDown } from "lucide-react";

const DEFAULT_VISIBLE_COUNT = 10;

export default function PropertyTypeNav({ visibleCount = DEFAULT_VISIBLE_COUNT }: { visibleCount?: number }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPropertyType = useSelector((state: RootState) => state.property.filters.property_type);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  const visibleTypes = PropertyTypeArray.slice(0, visibleCount);
  const hiddenTypes = PropertyTypeArray.slice(visibleCount);
  const activeTypeIsHidden = hiddenTypes.some((t) => currentPropertyType?.includes(t));

  useEffect(() => {
    const type = searchParams.get('type');
    if (type && (!currentPropertyType || !currentPropertyType.includes(type))) {
      dispatch(setFilters({ property_type: [type], page: 1 }));
    }
  }, [searchParams, dispatch, currentPropertyType]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const createQueryString = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null) {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handlePropertyTypeClick = (type: string | null) => {
    dispatch(setFilters({ property_type: type ? [type] : undefined, page: 1 }));
    const queryString = type ? createQueryString("type", type) : createQueryString("type", null);
    router.push(pathname + (queryString ? "?" + queryString : ""));
    setDropdownOpen(false);
  };

  const formatDisplayText = (type: string) =>
    type.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const btnClass = (active: boolean) =>
    `whitespace-nowrap pb-1 text-sm transition-colors ${
      active
        ? "text-indigo-600 border-b-2 border-indigo-600 font-medium"
        : "text-gray-600 hover:text-gray-900"
    }`;

  return (
    <div className="max-w-7xl mx-auto px-4">
      <ul className="flex items-center gap-6 py-3">
        {/* All */}
        <li>
          <button
            onClick={() => handlePropertyTypeClick(null)}
            className={btnClass(!currentPropertyType || currentPropertyType.length === 0)}
          >
            All
          </button>
        </li>

        {/* Visible types */}
        {visibleTypes.map((type: PropertyType) => (
          <li key={type}>
            <button
              onClick={() => handlePropertyTypeClick(type)}
              className={btnClass(!!currentPropertyType?.includes(type))}
            >
              {formatDisplayText(type)}
            </button>
          </li>
        ))}

        {/* More dropdown */}
        {hiddenTypes.length > 0 && (
          <li className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className={`flex items-center gap-1 pb-1 text-sm transition-colors ${
                activeTypeIsHidden
                  ? "text-indigo-600 border-b-2 border-indigo-600 font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              More
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg py-1.5 z-50 min-w-[160px]">
                {hiddenTypes.map((type: PropertyType) => (
                  <button
                    key={type}
                    onClick={() => handlePropertyTypeClick(type)}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      currentPropertyType?.includes(type)
                        ? "text-indigo-600 bg-indigo-50 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {formatDisplayText(type)}
                  </button>
                ))}
              </div>
            )}
          </li>
        )}
      </ul>
    </div>
  );
} 