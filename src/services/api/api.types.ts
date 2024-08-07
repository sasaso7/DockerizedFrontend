export type Login = {
  email: string;
  password: string;
};
export type LoginResult = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};
export type RefreshResult = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
};
export type Register = {
  email: string;
  password: string;
};
export type ReponseFailed = {
  title: string;
  detail: string;
};

export type AccountCreate = {
  name: string;
  userId: string;
};

export type AccountPictureCreate = {
  accountId: string;
  file: File;
};

export type AccountDelete = {
  accountId: string;
};

export type Account = {
  id: string;
  picture: string;
  name: string;
  userId: string;
};

export type UserResponse = {
  id: string;
  email: string;
  favoriteAnimal: string;
  accounts: Account[];
};
//NEVER USED BUT NEEDED FOR SAFETY
export interface FullUserResponse {
  id: string;
  userName: string;
  normalizedUserName: string;
  email: string;
  normalizedEmail: string;
  emailConfirmed: boolean;
  passwordHash: string;
  securityStamp: string;
  concurrencyStamp: string;
  phoneNumber: string;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnd: string | null;
  lockoutEnabled: boolean;
  accessFailedCount: number;
  favoriteAnimal: string;
  accounts: Account[];
}

export type FullActivityResponse = {
  id: string;
  accountId: string;
  account: Account;
  name: string;
  description: string;
  created: Date;
};

export type Activity = {
  id: string;
  accountId: string;
  name: string;
  description: string;
  createDate: Date;
};

export type CreateActivity = {
  accountId: string;
  name: string;
  description: string;
};

export interface KanyeQuoteRequest {
  accountId: string;
}
export interface RandomFactRequest {
  accountId: string;
}

export interface RandomFactResponse {
  fact: string;
  origin: string;
  originURL: string;
}
