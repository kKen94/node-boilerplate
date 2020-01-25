export interface UserAddDto {
  password: string;
  username: string;
  permissionsId: string[];
}

export interface UserUpdateDto {
  phoneNumber: string;
  permissionsId: string[];
}
