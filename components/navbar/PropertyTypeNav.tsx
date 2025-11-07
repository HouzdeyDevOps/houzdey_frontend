import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "@/store/slices/propertySlice";
import { RootState } from "@/store/store";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { PropertyType, PropertyTypeArray } from "@/@types/create-listing";


export default function PropertyTypeNav() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPropertyType = useSelector((state: RootState) => state.property.filters.property_type);

  useEffect(() => {
    const type = searchParams.get('type');
    if (type && (!currentPropertyType || !currentPropertyType.includes(type))) {

      dispatch(setFilters({
        property_type: [type],
        page: 1
      }));
    }
  }, [searchParams, dispatch, currentPropertyType]);

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

    const filterUpdate = {
      property_type: type ? [type] : undefined,
      page: 1
    };

    dispatch(setFilters(filterUpdate));

    const queryString = type ? createQueryString("type", type) : createQueryString("type", null);
    const newPath = pathname + (queryString ? "?" + queryString : "");

    router.push(newPath);
  };

  const formatDisplayText = (type: string) => {
    return type.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      <ul className="flex gap-8 overflow-x-auto py-4 no-scrollbar">
        <li>
          <button
            onClick={() => handlePropertyTypeClick(null)}
            className={`text-gray-600 hover:text-gray-900 font-medium pb-1 ${
              !currentPropertyType || currentPropertyType.length === 0 ? "text-indigo-600 border-b-2 border-indigo-600" : ""
            }`}
          >
            All
          </button>
        </li>
        {PropertyTypeArray.map((type: PropertyType) => (
          <li key={type}>
            <button
              onClick={() => handlePropertyTypeClick(type)}
              className={`text-gray-600 hover:text-gray-900 whitespace-nowrap pb-1 ${
                currentPropertyType?.includes(type)
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : ""
              }`}
            >
              {formatDisplayText(type)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
} 