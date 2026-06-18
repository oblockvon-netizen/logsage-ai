export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export type JwtPayload = {
  sub: string;
  email: string;
};
