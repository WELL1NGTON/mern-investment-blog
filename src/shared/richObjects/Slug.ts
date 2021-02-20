import slugify from "slugify";
import slugifyOptions from "@shared/configurations/slugifyOptions";

class Slug {
  private _value: string;

  constructor(slug: string) {
    this.value = slug;
  }

  public get value(): string {
    return this._value;
  }

  public set value(slug: string) {
    this._value = slugify(slug, slugifyOptions);
  }

  public static slugifyString(str: string): string {
    return slugify(str, slugifyOptions);
  }

  public toString(): string {
    return this._value;
  }

  public toJSON(): unknown {
    return this._value;
  }
}

export default Slug;
