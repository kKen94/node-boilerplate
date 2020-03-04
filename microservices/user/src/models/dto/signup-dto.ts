export interface SignUpRequestDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  companyName?: string;
}
