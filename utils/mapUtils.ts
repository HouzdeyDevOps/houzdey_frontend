export const generateGoogleMapsEmbedUrl = (property: any) => {
  const formattedAddress = encodeURIComponent(
    `${property.address}, ${property.lga}, ${property.state}, Nigeria`
  );
  return `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${formattedAddress}`;
};

// export const generateGoogleMapsEmbedUrl = (property: {
//     address: string;
//     state: string;
//     lga: string;
//     ward: string;
//     estate?: string;
//   }) => {
//     const fullAddress = [
//       property.address,
//       property.estate,
//       property.ward,
//       property.lga,
//       property.state,
//       'Nigeria'
//     ].filter(Boolean).join(', ');

//     return `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(fullAddress)}&zoom=15`;
//   };
