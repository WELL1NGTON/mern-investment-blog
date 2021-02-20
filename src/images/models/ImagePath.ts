import Entity from "@shared/models/Entity";
import Slug from "@shared/richObjects/Slug";

class ImagePath extends Entity {
  private _slug: Slug;
  private _name: string;
  public tags: string[];
  public url: string;
  public bucket: string;
  public firebaseFileName: string;
  public firebaseStorageDownloadTokens: string;
  public uploadedBy: string;

  constructor(
    name: string,
    tags: string[],
    url: string,
    bucket: string,
    firebaseFileName: string,
    firebaseStorageDownloadTokens: string,
    uploadedBy: string
  ) {
    super();

    this.name = name;
    this.tags = tags;
    this.url = url;
    this.bucket = bucket;
    this.firebaseFileName = firebaseFileName;
    this.firebaseStorageDownloadTokens = firebaseStorageDownloadTokens;
    this.uploadedBy = uploadedBy;
  }

  public get slug(): string {
    return this._slug.toString();
  }

  public set name(name: string) {
    this._name = name;
    this._slug.value = name;
  }

  public get name(): string {
    return this._name;
  }

  public toString(): string {
    return this.url;
  }

  public toJSON(): unknown {
    return {
      slug: this.slug,
      name: this.name,
      tags: this.tags,
      url: this.url,
      bucket: this.bucket,
      firebaseFileName: this.firebaseFileName,
      firebaseStorageDownloadTokens: this.firebaseStorageDownloadTokens,
      uploadedBy: this.uploadedBy,
    };
  }
}

export default ImagePath;
