import { FormData } from "@/@types/create-listing";

export function generatePropertyTitle(formData: FormData): string {
  const type = formData.type || '';
  const beds = formData.beds ? `${formData.beds} Bedroom` : '';
  const location = formData.ward ? 
    `in ${formData.ward.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}, ${
      formData.lga.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}, ${
      formData.state.charAt(0).toUpperCase() + formData.state.slice(1)}` : '';

  const parts = [beds, type, location].filter(Boolean);
  return parts.join(' ');
} 

interface GenerateTitleProps {
    bedrooms: number;
    propertyType: string;
    estateName: string;
    location: string;
}

function generateTitle({ bedrooms, propertyType, estateName, location }: GenerateTitleProps) {
    let title = `${bedrooms}-Bedroom ${propertyType}`;
    if (estateName) {
      title += ` in ${estateName}`;
    }
    if (location) {
      title += `, ${location}`;
    }
    return title;
  }
  