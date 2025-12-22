export enum Department {
  FRONTEND = 'frontend',
  BACKEND = 'backend',
  SALES = 'sales',
  HR = 'hr',
  PRODUCT = 'product',
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  department: Department;
  createdAt: Date;
}

export interface UserWithPassword extends User {
  passwordHash: string;
}

export type PublicUser = Pick<User, 'id' | 'displayName' | 'department'>;
