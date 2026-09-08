  // function that format state, lga, ward by capitalizing the first letter and removing dash
export const formatLocation = (address: string | undefined | null) => {
    if (!address || typeof address !== 'string') {
      return '';
    }
    return address
      .split(/[-\s]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };