import ArticleState, {
  defaultArticleState,
  matchArticleStates,
} from "@shared/types/ArticleState";
import { Joi, Segments, celebrate } from "celebrate";
import { Request, RequestHandler } from "express";
import Visibility, {
  defaultVisibility,
  matchVilibilities,
} from "@shared/types/Visibility";

import Command from "@shared/messages/Command";
import { isValidObjectId } from "mongoose";

class UpdateArticleCommand extends Command {
  slug: string;
  title: string;
  description: string;
  markdownArticle: string;
  visibility: Visibility;
  state: ArticleState;
  tags: string[];
  date: Date;
  categoryId?: string;
  authorId?: string;
  previewImg?: string;

  constructor(
    slug: string,
    title: string,
    description: string,
    markdownArticle: string,
    visibility: Visibility,
    state: ArticleState,
    tags: string[],
    date: Date = new Date(Date.now()),
    categoryId?: string,
    authorId?: string,
    previewImg?: string
  ) {
    super();

    this.slug = slug;
    this.title = title;
    this.description = description;
    this.markdownArticle = markdownArticle;
    this.visibility = visibility;
    this.state = state;
    this.tags = tags;
    this.date = date;
    this.categoryId = categoryId;
    this.previewImg = previewImg;
    this.authorId = authorId;
  }

  public static validator: RequestHandler = celebrate(
    {
      [Segments.PARAMS]: {
        slug: Joi.string().required(),
      },
      [Segments.BODY]: {
        title: Joi.string().min(3).required(),
        categoryId: Joi.string().custom((category) =>
          isValidObjectId(category)
        ),
        author: Joi.string()
          .optional()
          .custom((author) => isValidObjectId(author)),
        description: Joi.string().required(),
        markdownArticle: Joi.string().required(),
        date: Joi.date().optional().default(new Date(new Date().getTime())),
        visibility: Joi.string()
          .custom((visibility) => matchVilibilities(visibility))
          .default(defaultVisibility),
        state: Joi.string()
          .custom((state) => matchArticleStates(state))
          .default(defaultArticleState),
        tags: Joi.array().items(Joi.string()).required(),
        previewImg: Joi.string().uri().optional(),
      },
    },
    { abortEarly: false }
  );

  public static requestToCommand = (request: Request): UpdateArticleCommand => {
    const command = new UpdateArticleCommand(
      request.params.slug,
      request.body.title,
      request.body.description,
      request.body.markdownArticle,
      request.body.visibility,
      request.body.state,
      request.body.tags,
      request.body.date,
      request.body.categoryId,
      request.body.authorId,
      request.body.previewImg
    );

    return command;
  };
}

export default UpdateArticleCommand;
