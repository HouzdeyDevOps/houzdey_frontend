// app/properties/[id]/page.tsx
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchProperty = async (id: string) => {
  const { data } = await axios.get(`/api/properties/${id}`);
  return data;
};

export default function PropertyPage({ params }: { params: { id: string } }) {
  const { data, isLoading, error } = useQuery(["property", params.id], () => fetchProperty(params.id));

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return <div>{data.name}</div>;
}
