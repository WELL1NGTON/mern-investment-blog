import ArticleState, { defaultArticleState } from "@shared/types/ArticleState";
import Visibility, { defaultVisibility } from "@shared/types/Visibility";

import Entity from "@shared/models/Entity";
import slugify from "slugify";
import slugifyOptions from "@articles/configurations/slugifyOptions";

class Article extends Entity {
  private _slug: string = "";
  private _title: string = "";
  category?: string;
  author?: string;
  description: string = "";
  markdownArticle: string = "";
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

  public get slug() {
    return this._slug;
  }

  public get title() {
    return this._title;
  }

  public set title(theTitle: string) {
    this._title = theTitle;
    this._slug = slugify(this._title, slugifyOptions);
  }

  public setTags(tagsStr: string) {
    const regex = /[\u00C0-\u00FF]*?\b[\w\u00C0-\u00FF\s\-.']+\b/gim;

    this.tags = tagsStr.match(regex) ?? [];
  }

  public toJSON() {
    return {
      id: this.id,
      slug: this._slug,
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
