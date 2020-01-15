export interface LoginRequestDto {
  username: string;
  password: string;
}

export interface LoginResponseDto {
  id: string;
  email: string;
  token: string;
  username: string;
  // image: ;
  forceResetPassword: boolean;
}

export class LoginResponseDto {
  constructor(
    id: string,
    email: string,
    username: string,
    token: string,
    // image:
    forceResetPassword: boolean,
  ) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.token = token;
    // this.image = image;
    this.forceResetPassword = forceResetPassword;
  }
}
