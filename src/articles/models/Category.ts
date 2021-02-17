import Color from "@shared/richObjects/Color";
import Entity from "@shared/models/Entity";
import Visibility from "@shared/types/Visibility";

/**
 * @description Category Entity class wich group Articles for better organization.
 * @export
 * @class Category
 * @classdesc Entity
 */
class Category extends Entity {
  constructor(name: string, color: string, visibility: Visibility = "ALL") {
    super();

    this.name = name;
    this.color = new Color(color);
    this.visibility = visibility;
  }

  /**
   * @description Category name
   * @type {string}
   * @memberof Category
   */
  name: string = "";

  /**
   * @description Inform to who it will appear
   * @type {Visibility}
   * @memberof Category
   */
  visibility: Visibility = "ALL";

  /**
   * @description Description color in hex rpg (#hhhhhh)
   * @type {Color}
   * @memberof Category
   */
  color: Color;

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      color: this.color.value,
      visibility: this.visibility,
    };
  }
}

export default Category;
