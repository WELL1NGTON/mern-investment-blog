import { visibilities } from "./Visibility";

const permissions = [
  `VIEW_ARTICLE_VISIBILITY_${visibilities[0]}`,
  `VIEW_ARTICLE_VISIBILITY_${visibilities[1]}`,
  `VIEW_ARTICLE_VISIBILITY_${visibilities[2]}`,
  `LIST_ARTICLES_VISIBILITY_${visibilities[0]}`,
  `LIST_ARTICLES_VISIBILITY_${visibilities[1]}`,
  `LIST_ARTICLES_VISIBILITY_${visibilities[2]}`,
  "CREATE_ARTICLE",
  "EDIT_ARTICLE",
  "DELETE_ARTICLE",
  `VIEW_CATEGORY_VISIBILITY_${visibilities[0]}`,
  `VIEW_CATEGORY_VISIBILITY_${visibilities[1]}`,
  `VIEW_CATEGORY_VISIBILITY_${visibilities[2]}`,
  `LIST_CATEGORIES_VISIBILITY_${visibilities[0]}`,
  `LIST_CATEGORIES_VISIBILITY_${visibilities[1]}`,
  `LIST_CATEGORIES_VISIBILITY_${visibilities[2]}`,
  "CREATE_CATEGORY",
  "EDIT_CATEGORY",
  "DELETE_CATEGORY",
  "VIEW_USER",
  "LIST_USERS",
  "CREATE_USER",
  "EDIT_USER",
  "ENABLE_USER",
  "DISABLE_USER",
  "DELETE_USER",
  "VIEW_PROFILE",
  "LIST_PROFILES",
  "EDIT_PROFILE",
  "VIEW_IMAGE",
  "LIST_IMAGES",
  "UPLOAD_IMAGE",
  "DELETE_IMAGE",
] as const;

type Permission = typeof permissions[number];

const isStringPermission = (permission: string): boolean => {
  return permissions.includes(permission as Permission);
};

export { permissions, isStringPermission };

export default Permission;
