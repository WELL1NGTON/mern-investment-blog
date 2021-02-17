const roles = ["ADMIN", "WRITER", "USER"] as const;

type Role = typeof roles[number];

const matchRoles = (role: string): boolean => {
  return roles.includes(role as Role);
};

const defaultRole: Role = "USER";

export default Role;

export { roles, matchRoles, defaultRole };
