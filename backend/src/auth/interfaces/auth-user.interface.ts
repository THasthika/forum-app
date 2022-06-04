export interface IAuthUser {
  id: string;
  username: string;
  email: string;
  isBanned: boolean;
  permissions: string[];
}
