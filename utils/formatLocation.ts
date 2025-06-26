  // function that format state, lga, ward by capitalizing the first letter and removing dash
export const formatLocation = (address: string | undefined | null) => {
    if (!address || typeof address !== 'string') {
      return '';
    }
    return (
      address.charAt(0).toUpperCase() + address.slice(1).replace(/-/g, " ")
    );
  };