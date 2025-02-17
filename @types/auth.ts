export interface GetStartedParams {
  firstname: string;
  lastname: string;
  business_email: string;
  organization_name: string;
  no_of_employees: number | string;
  phone_number: string;
  need_description: string;
  discovery_info: string;
  type: string;
  sub_type: string;
  password: string;
}

export interface AdminSignInParams {
  email: string;
  password: string;
}

export interface UserSignInParams {
  email: string;
  password: string;
}

export interface PersonalInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PersonalInfoData) => void;
  email: string; 
}

export interface PersonalInfoData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
  profilePicture?: File;
}

export interface SignInResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    status: string;
    profile_picture: string;
  }
}

export interface UserSignInParams {
  email: string;
  password: string;
}

export interface SocialAuthResponse {
  access_token: string;
  token_type: string;
  user: UserProfile;
}

export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  status: string;
  profile_picture: string;
}

export interface GoogleAuthParams {
  access_token: string;
  provider: 'google';
}

export interface AuthError {
  type: 'UNVERIFIED_EMAIL' | 'INVALID_CREDENTIALS' | 'GENERAL_ERROR';
  message: string;
  email?: string;
}