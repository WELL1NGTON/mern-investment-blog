const permissions = [
  "createUser",
  "deleteUser",
  "editUser",
  "createArticle",
  "editArticle",
  "deleteArticle",
  "viewArticle",
] as const;

type Permission = typeof permissions[number];

export { permissions };

export default Permission;
