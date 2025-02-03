import Link from "next/link";

const PROPERTY_TYPES = [
  "Apartments",
  "Bungalows",
  "Detached houses",
  "Duplexes",
  "Flats",
  "Mansions",
  "Office spaces",
  "Penthouses",
];

export default function PropertyTypeNav() {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <ul className="flex gap-8 overflow-x-auto py-4">
        <li>
          <Link
            href="/"
            className="text-indigo-600 font-medium border-b-2 border-indigo-600 pb-1"
          >
            All
          </Link>
        </li>
        {PROPERTY_TYPES.map((type) => (
          <li key={type}>
            <Link
              href={`/properties?type=${type.toLowerCase()}`}
              className="text-gray-600 hover:text-gray-900"
            >
              {type}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
} 