import React, { useState } from 'react';
import { useMutation } from 'react-query';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PostProperty = () => {
  const [propertyData, setPropertyData] = useState({
    availability_status: '',
    location_state: '',
    location_area: '',
    description: '',
    price: 0,
    property_address: '',
    estate_name: '',
    property_type: '',
    condition: '',
    furnishing: '',
    bedrooms: 0,
    bathrooms: 0,
    toilets: 0,
    caution_fee: 0,
    agency_fee: 0,
    other_fees: 0,
    facilities: [],
    listing_by: ''
  });
  const [images, setImages] = useState([]);

  const postProperty = async (data) => {
    const formData = new FormData();
    formData.append('property_data', JSON.stringify(data.propertyData));
    data.images.forEach((image) => {
      formData.append('images', image);
    });

    const response = await axios.post('http://127.0.0.1:8000/api/v1/properties/properties/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming you store the token in localStorage
      }
    });
    return response.data;
  };

  const mutation = useMutation(postProperty, {
    onMutate: () => {
      toast.loading('Posting property...', { toastId: 'postProperty' });
    },
    onSuccess: () => {
      toast.update('postProperty', {
        render: 'Property posted successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });
    },
    onError: (error) => {
      toast.update('postProperty', {
        render: `Error posting property: ${error.message}`,
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPropertyData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ propertyData, images });
  };

  return (
    <div>
      <h2>Post a Property</h2>
      <form onSubmit={handleSubmit}>
        {/* Add input fields for all propertyData fields */}
        <input
          type="text"
          name="availability_status"
          value={propertyData.availability_status}
          onChange={handleInputChange}
          placeholder="Availability Status"
        />
        {/* ... Add more input fields for other properties ... */}
        <input
          type="file"
          multiple
          onChange={handleImageChange}
        />
        <button type="submit" disabled={mutation.isLoading}>
          {mutation.isLoading ? 'Posting...' : 'Post Property'}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default PostProperty;