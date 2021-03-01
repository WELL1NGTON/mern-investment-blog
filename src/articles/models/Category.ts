import Color from "@shared/valueObjects/Color";
import Entity from "@shared/models/Entity";
import Visibility from "@shared/types/Visibility";

class Category extends Entity {
  constructor(name: string, color: string, visibility: Visibility = "ALL") {
    super();

    this.name = name;
    this.color = new Color(color);
    this.visibility = visibility;
  }

  name = "";
  visibility: Visibility = "ALL";
  color: Color;

  public toJSON(): unknown {
    return {
      id: this.id,
      name: this.name,
      color: this.color.value,
      visibility: this.visibility,
    };
  }
}

export default Category;
