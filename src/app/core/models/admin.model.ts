export interface AdminAccount {
  Member_ID: number;
  Username: string;
  Email: string;
  First_Name: string | null;
  Last_Name: string | null;
  Profile_Image: string | null;
  User_Role: 'Admin' | 'Master_Admin';
  Account_Status: 'Active' | 'Suspended';
  Created_At: string;
}

export interface CreateAdminRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}
