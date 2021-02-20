import AppError from "@shared/errors/AppError";
import Article from "@articles/models/Article";
import ArticleRepository from "@articles/data/repository/ArticleRepository";
import ArticleState from "@shared/types/ArticleState";
import Category from "@articles/models/Category";
import CategoryRepository from "@articles/data/repository/CategoryRepository";
import Profile from "@users/models/Profile";
import ProfileRepository from "@users/data/repository/ProfileRepository";
import Role from "@shared/types/Role";
import User from "@users/models/User";
import UserRepository from "@users/data/repository/UserRepository";
import Visibility from "@shared/types/Visibility";
import articlesJson from "@app/data/testData/articles.json";
import categoriesJson from "@app/data/testData/categories.json";
import markdowns from "@app/data/testData/markdowns";
import profilesJson from "@app/data/testData/profiles.json";
import usersJson from "@app/data/testData/users.json";

const addTestData = async (): Promise<void> => {
  const categories = categoriesJson.map((category) => {
    const cat = new Category(
      category.name,
      category.color,
      category.visibility as Visibility
    );

    cat.name += cat.id.substr(cat.id.length - 3, 3);

    return cat;
  });

  if (usersJson.length !== profilesJson.length)
    throw new AppError("Erro importando dados");
  const users = new Array<User>();
  const profiles = new Array<Profile>();

  for (let i = 0; i < usersJson.length; i++) {
    const user = new User(
      usersJson[i].email,
      usersJson[i].password,
      usersJson[i].role as Role,
      usersJson[i].isActive
    );

    user.encryptPassword();

    const profile = new Profile(
      profilesJson[i].name,
      profilesJson[i].about,
      profilesJson[i].profileImage,
      [
        ["facebook", "link_facebook"],
        ["linkedin", "link_linkedin"],
      ]
    );

    profile.id = user.id;

    users.push(user);
    profiles.push(profile);
  }

  const articles = articlesJson.map((article) => {
    const art = new Article(
      article.title,
      article.description,
      markdowns[Math.floor(Math.random() * markdowns.length)],
      new Date(Date.parse(article.date)),
      categories[Math.floor(Math.random() * categories.length)].id,
      profiles[Math.floor(Math.random() * profiles.length)].id,
      article.tags,
      article.visibility as Visibility,
      article.state as ArticleState,
      article.previewImg
    );
    art.title += art.id.substr(art.id.length - 3, 3);

    return art;
  });
  const categoryRepository = new CategoryRepository();
  const profileRepository = new ProfileRepository();
  const userRepository = new UserRepository();
  const articleRepository = new ArticleRepository();

  for (let i = 0; i < articles.length; i++) {
    await articleRepository.create(articles[i]);
  }

  for (let i = 0; i < categories.length; i++) {
    await categoryRepository.create(categories[i]);
  }

  for (let i = 0; i < users.length; i++) {
    await userRepository.create(users[i]);
  }

  for (let i = 0; i < profiles.length; i++) {
    await profileRepository.create(profiles[i]);
  }

  console.log("Teste");
};

export default addTestData;
