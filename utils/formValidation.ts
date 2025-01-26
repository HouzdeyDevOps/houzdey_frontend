interface FormErrors {
    [key: string]: string;
  }
  
  export const validatePropertyForm = (formData: any, step: number): FormErrors => {
    const errors: FormErrors = {};
  
    switch (step) {
      case 1:
        if (!formData.title) errors.title = "Title is required";
        if (!formData.type) errors.type = "Property type is required";
        if (!formData.price) errors.price = "Price is required";
        break;
      case 2:
        if (!formData.location) errors.location = "Location is required";
        if (!formData.beds) errors.beds = "Number of bedrooms is required";
        if (!formData.baths) errors.baths = "Number of bathrooms is required";
        break;
      // Add validation for other steps
    }
  
    return errors;
  };