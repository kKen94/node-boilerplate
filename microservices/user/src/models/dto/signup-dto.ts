export interface SignUpRequestDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  callbackUrl: string;
  companyName?: string;
}
