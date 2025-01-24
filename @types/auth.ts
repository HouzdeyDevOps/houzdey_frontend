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
