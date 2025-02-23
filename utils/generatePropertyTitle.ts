import { CreateListingFormData as FormData } from "@/@types/create-listing";


export function generatePropertyTitle(formData: FormData): string {
  const parts: string[] = [];
  
  // Add furnishing if it's furnished
  if (formData.furnishing?.toLowerCase() === 'furnished') {
    parts.push('furnished');
  }

  // Add bedrooms and property type
  parts.push(`${formData.beds}-Bedroom`);
  parts.push(formData.type.charAt(0).toUpperCase() + formData.type.slice(1));

  // Add estate if available
  if (formData.estate) {
    parts.push(`in ${formData.estate.charAt(0).toUpperCase() + formData.estate.slice(1)} Estate`);
  }

  // Add ward if available, with comma
  if (formData.ward) {
    parts.push(`, ${formData.ward.charAt(0).toUpperCase() + formData.ward.slice(1)}`);
  }

  // Join all parts with proper spacing and capitalize first letter
  const title = parts.join(' ');
  return title.charAt(0).toUpperCase() + title.slice(1);
}
