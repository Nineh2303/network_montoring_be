export interface RegisterUserRequest {
  userName: string;
  password: string;
  role: string;
}

export interface IUser {
  _id: string;
  fullName: string;
  userName: string;
  password: string;
  role: string;
}

export interface IUserRoleUser {
  _id: string;
  fullName: string;
}
