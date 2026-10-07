export enum UserRole {
  ADMIN = 'admin',
  DEMO = 'demo',
}

export const ALL_ROLES = [UserRole.ADMIN, UserRole.DEMO] as const;
