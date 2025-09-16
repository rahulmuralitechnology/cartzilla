import { IUser, UserRole } from "../authService";
import { ROLE_PERMISSIONS } from "../interfaces/permission";

// Check if user has specific permission
export const hasPermission = (user: IUser | null, permission: string): boolean => {
  if (!user) return false;
  return user?.permissions?.includes(permission) || false;
};

// Check if user has any of the permissions
export const hasAnyPermission = (user: IUser | null, permissions: string[]): boolean => {
  if (!user) return false;
  return permissions.some((permission) => user?.permissions?.includes(permission));
};

// Check if user has specific role
export const hasRole = (user: IUser | null, role: UserRole): boolean => {
  if (!user) return false;
  return user.role === role;
};

// Check if user has specific role or higher (in terms of permissions)
export const hasRoleOrHigher = (user: IUser | null, role: UserRole): boolean => {
  if (!user) return false;

  const roles: UserRole[] = ["USER", "CUSTOMER", "CLIENT", "ADMIN", "SUPERADMIN"];
  const userRoleIndex = roles.indexOf(user?.role as UserRole);
  const requiredRoleIndex = roles.indexOf(role);

  return userRoleIndex >= requiredRoleIndex;
};

// Get role permissions for a specific role
export const getRolePermissions = (role: UserRole): string[] => {
  return ROLE_PERMISSIONS[role] || [];
};

// Get role display name
export const getRoleDisplayName = (role: UserRole): string => {
  const roleMap: Record<UserRole, string> = {
    ADMIN: "Administrator",
    SUPERADMIN: "Super Administrator",
    CLIENT: "Client",
    CUSTOMER: "Customer",
    USER: "User",
  };

  return roleMap[role] || role;
};
