export interface StepProps {
    onSubmit: (value: string) => Promise<void>;
    initialValue?: string;
    isLoading?: boolean;
  }
  
  export interface User {
    email: string;
    displayname: string;
    phone_no: string;
    country: string;
    state: string;
    city: string;
    pincode: string;
    standard: string;
    board: string;
  }
  
  export interface Location {
    country_name: string;
    state_name: string;
    city_name: string;
  }