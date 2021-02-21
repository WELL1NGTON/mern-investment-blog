import { ApiModel, ApiModelProperty } from "swagger-express-ts";
import ArticleState, { defaultArticleState } from "@shared/types/ArticleState";
import Visibility, { defaultVisibility } from "@shared/types/Visibility";

import Entity from "@shared/models/Entity";
import Slug from "@shared/richObjects/Slug";

class Article extends Entity {
  private _slug: Slug;
  private _title = "";
  category?: string;
  author?: string;
  description = "";
  markdownArticle = "";
  date: Date = new Date(Date.now());
  visibility: Visibility = "ALL";
  state: ArticleState = "EDITING";
  tags!: string[];
  previewImg?: string;

  constructor(
    title: string,
    description: string,
    markdownArticle: string,
    date: Date,
    category?: string,
    author?: string,
    tags: string[] = [],
    visibility: Visibility = defaultVisibility,
    state: ArticleState = defaultArticleState,
    previewImg?: string
  ) {
    super();
    this._slug = new Slug("");
    this.title = title;
    this.description = description;
    this.markdownArticle = markdownArticle;
    this.date = date;
    this.category = category;
    this.author = author;
    this.tags = tags;
    this.visibility = visibility;
    this.state = state;
    this.previewImg = previewImg;
  }

  public get slug(): string {
    return this._slug.value;
  }

  public get title(): string {
    return this._title;
  }

  public set title(theTitle: string) {
    this._title = theTitle;
    this._slug.value = theTitle;
  }

  public setTags(tagsStr: string): void {
    const regex = /[\u00C0-\u00FF]*?\b[\w\u00C0-\u00FF\s\-.']+\b/gim;

    this.tags = tagsStr.match(regex) ?? [];
  }

  public toJSON(): unknown {
    return {
      id: this.id,
      slug: this.slug,
      title: this._title,
      description: this.description,
      markdownArticle: this.markdownArticle,
      date: this.date,
      category: this.category,
      author: this.author,
      tags: this.tags,
      visibility: this.visibility,
      state: this.state,
      previewImg: this.previewImg,
    };
  }
}

export default Article;
