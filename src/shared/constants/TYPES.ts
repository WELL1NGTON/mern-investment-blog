// TYPES for inversify

const TYPES = {
  IArticleRepository: Symbol.for("ArticleRepository"),

  CreateArticleService: Symbol.for("CreateArticleService"),
  DeleteArticleService: Symbol.for("DeleteArticleService"),
  GetArticleService: Symbol.for("GetArticleService"),
  ListArticlesService: Symbol.for("ListArticlesService"),
  UpdateArticleService: Symbol.for("UpdateArticleService"),

  ICategoryRepository: Symbol.for("ICategoryRepository"),

  CreateCategoryService: Symbol.for("CreateCategoryService"),
  DeleteCategoryService: Symbol.for("DeleteCategoryService"),
  GetCategoryService: Symbol.for("GetCategoryService"),
  ListCategoriesService: Symbol.for("ListCategoriesService"),
  UpdateCategoryService: Symbol.for("UpdateCategoryService"),

  IUserRepository: Symbol.for("IUserRepository"),

  ChangeUserPasswordService: Symbol.for("ChangeUserPasswordService"),
  DisableUserService: Symbol.for("DisableUserService"),
  EnableUserService: Symbol.for("EnableUserService"),
  GetUserService: Symbol.for("GetUserService"),
  ListUsersService: Symbol.for("ListUsersService"),
  UpdateUserService: Symbol.for("UpdateUserService"),

  IProfileRepository: Symbol.for("IProfileRepository"),

  GetProfileService: Symbol.for("GetProfileService"),
  ListProfilesService: Symbol.for("ListProfilesService"),
  UpdateProfileService: Symbol.for("UpdateProfileService"),

  CreateUserAndProfileService: Symbol.for("CreateUserAndProfileService"),
  DeleteUserAndProfileService: Symbol.for("DeleteUserAndProfileService"),

  IImagePathRepository: Symbol.for("IImagePathRepository"),

  CreateImagePathService: Symbol.for("CreateImagePathService"),
  DeleteImagePathService: Symbol.for("DeleteImagePathService"),
  GetImagePathService: Symbol.for("GetImagePathService"),
  ListImagePathService: Symbol.for("ListImagePathService"),
  UpdateImagePathService: Symbol.for("UpdateImagePathService"),

  IRefreshTokenRepository: Symbol.for("IRefreshTokenRepository"),

  LoginService: Symbol.for("LoginService"),
  LogoutService: Symbol.for("LogoutService"),

  EnsureAuthenticated: Symbol.for("EnsureAuthenticated"),
};

export default TYPES;
