import ArticleRepository from "@articles/data/repository/ArticleRepository";
import AuthService from "@auth/services/AuthService";
import CategoryRepository from "@articles/data/repository/CategoryRepository";
import ChangeUserPasswordService from "@users/services/users/ChangeUserPasswordService";
import { Container } from "inversify";
import CreateArticleService from "@articles/services/articles/CreateArticleService";
import CreateCategoryService from "@articles/services/categories/CreateCategoryService";
import CreateUserAndProfileService from "@users/services/CreateUserAndProfileService";
import CustomAuthProvider from "@auth/services/CustomAuthProvider";
import CustomPrincipal from "@auth/services/CustomPrincipal";
import DeleteArticleService from "@articles/services/articles/DeleteArticleService";
import DeleteCategoryService from "@articles/services/categories/DeleteCategoryService";
import DeleteImageService from "@images/services/DeleteImageService";
import DeleteUserAndProfileService from "@users/services/DeleteUserAndProfileService";
import DisableUserService from "@users/services/users/DisableUserService";
import EnableUserService from "@users/services/users/EnableUserService";
import GetArticleService from "@articles/services/articles/GetArticleService";
import GetCategoryService from "@articles/services/categories/GetCategoryService";
import GetImageService from "@images/services/GetImageService";
import GetProfileService from "@users/services/profile/GetProfileService";
import GetUserService from "@users/services/users/GetUserService";
import IArticleRepository from "@articles/models/IArticleRepository";
import ICategoryRepository from "@articles/models/ICategoryRepository";
import IImagePathRepository from "@images/models/IImagePathRepository";
import IProfileRepository from "@users/models/IProfileRepository";
import IRefreshTokenRepository from "@auth/models/IRefreshTokenRepository";
import IUserRepository from "@users/models/IUserRepository";
import ImagePathRepository from "@images/data/repository/ImagePathRepository";
import ListArticlesService from "@articles/services/articles/ListArticlesService";
import ListCategoriesService from "@articles/services/categories/ListCategoriesService";
import ListImagesService from "@images/services/ListImagesService";
import ListProfilesService from "@users/services/profile/ListProfilesService";
import ListUsersService from "@users/services/users/ListUsersService";
import LoginService from "@auth/services/LoginService";
import LogoutService from "@auth/services/LogoutService";
import MulterMiddlewareImage from "@images/middlewares/MulterMiddlewareImage";
import ProfileRepository from "@users/data/repository/ProfileRepository";
import RefreshTokenRepository from "@auth/data/repository/RefreshTokenRepository";
import RefreshTokenService from "@auth/services/RefreshTokenService";
import TYPES from "@shared/constants/TYPES";
import UpdateArticleService from "@articles/services/articles/UpdateArticleService";
import UpdateCategoryService from "@articles/services/categories/UpdateCategoryService";
import UpdateProfileService from "@users/services/profile/UpdateProfileService";
import UpdateUserService from "@users/services/users/UpdateUserService";
import UploadImageService from "@images/services/UploadImageService";
import UserRepository from "@users/data/repository/UserRepository";
import express from "express";

const container = new Container();

// Repositories
container
  .bind<IArticleRepository>(TYPES.IArticleRepository)
  .to(ArticleRepository);

container
  .bind<ICategoryRepository>(TYPES.ICategoryRepository)
  .to(CategoryRepository);

container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);

container
  .bind<IProfileRepository>(TYPES.IProfileRepository)
  .to(ProfileRepository);

container
  .bind<IImagePathRepository>(TYPES.IImagePathRepository)
  .to(ImagePathRepository);

container
  .bind<IRefreshTokenRepository>(TYPES.IRefreshTokenRepository)
  .to(RefreshTokenRepository);

// Article Services
container
  .bind<CreateArticleService>(TYPES.CreateArticleService)
  .to(CreateArticleService);

container
  .bind<DeleteArticleService>(TYPES.DeleteArticleService)
  .to(DeleteArticleService);

container
  .bind<GetArticleService>(TYPES.GetArticleService)
  .to(GetArticleService);

container
  .bind<ListArticlesService>(TYPES.ListArticlesService)
  .to(ListArticlesService);

container
  .bind<UpdateArticleService>(TYPES.UpdateArticleService)
  .to(UpdateArticleService);

// Category Services
container
  .bind<CreateCategoryService>(TYPES.CreateCategoryService)
  .to(CreateCategoryService);

container
  .bind<DeleteCategoryService>(TYPES.DeleteCategoryService)
  .to(DeleteCategoryService);

container
  .bind<GetCategoryService>(TYPES.GetCategoryService)
  .to(GetCategoryService);

container
  .bind<ListCategoriesService>(TYPES.ListCategoriesService)
  .to(ListCategoriesService);

container
  .bind<UpdateCategoryService>(TYPES.UpdateCategoryService)
  .to(UpdateCategoryService);

// Auth Services
container.bind<LoginService>(TYPES.LoginService).to(LoginService);

container.bind<LogoutService>(TYPES.LogoutService).to(LogoutService);

container
  .bind<RefreshTokenService>(TYPES.RefreshTokenService)
  .to(RefreshTokenService);

container.bind<AuthService>(TYPES.AuthService).to(AuthService);

container
  .bind<CustomAuthProvider>(TYPES.CustomAuthProvider)
  .to(CustomAuthProvider);

container.bind<CustomPrincipal>(TYPES.CustomPrincipal).to(CustomPrincipal);

// Images Services

container
  .bind<MulterMiddlewareImage>(TYPES.MulterMiddlewareImage)
  .to(MulterMiddlewareImage);

container
  .bind<UploadImageService>(TYPES.UploadImageService)
  .to(UploadImageService);

container
  .bind<ListImagesService>(TYPES.ListImagesService)
  .to(ListImagesService);

container
  .bind<DeleteImageService>(TYPES.DeleteImageService)
  .to(DeleteImageService);

container.bind<GetImageService>(TYPES.GetImageService).to(GetImageService);

// container
//   .bind<CreateCategoryService>(TYPES.ICreateCategoryService)
//   .to(CreateCategoryService);

// container
//   .bind<DeleteCategoryService>(TYPES.IDeleteCategoryService)
//   .to(DeleteCategoryService);

// container
//   .bind<GetCategoryService>(TYPES.IGetCategoryService)
//   .to(GetCategoryService);

// container
//   .bind<ListCategoryService>(TYPES.IListCategoryService)
//   .to(ListCategoryService);

// container
//   .bind<UpdateCategoryService>(TYPES.IUpdateCategoryService)
//   .to(UpdateCategoryService);

// Users Services
container
  .bind<CreateUserAndProfileService>(TYPES.CreateUserAndProfileService)
  .to(CreateUserAndProfileService);

container
  .bind<DeleteUserAndProfileService>(TYPES.DeleteUserAndProfileService)
  .to(DeleteUserAndProfileService);

container
  .bind<ChangeUserPasswordService>(TYPES.ChangeUserPasswordService)
  .to(ChangeUserPasswordService);

container
  .bind<DisableUserService>(TYPES.DisableUserService)
  .to(DisableUserService);

container
  .bind<EnableUserService>(TYPES.EnableUserService)
  .to(EnableUserService);

container.bind<GetUserService>(TYPES.GetUserService).to(GetUserService);

container.bind<ListUsersService>(TYPES.ListUsersService).to(ListUsersService);

container
  .bind<UpdateUserService>(TYPES.UpdateUserService)
  .to(UpdateUserService);

// Profiles Services
container
  .bind<GetProfileService>(TYPES.GetProfileService)
  .to(GetProfileService);

container
  .bind<ListProfilesService>(TYPES.ListProfilesService)
  .to(ListProfilesService);

container
  .bind<UpdateProfileService>(TYPES.UpdateProfileService)
  .to(UpdateProfileService);

// Middleares
// container
//   .bind<EnsureAuthenticated>(TYPES.EnsureAuthenticated)
//   .to(EnsureAuthenticated);

export { container };
