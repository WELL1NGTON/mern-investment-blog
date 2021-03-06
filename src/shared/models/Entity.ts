import { ApiModel, ApiModelProperty } from "swagger-express-ts";

import IEntity from "./IEntity";
import mongoose from "mongoose";

class Entity implements IEntity {
  constructor() {
    const id = new mongoose.Types.ObjectId();
    this.id = id.toHexString();
    // this.id = mongoose.Types.ObjectId().toHexString();
  }

  public id!: string;

  public removeId(): void {
    this.id = mongoose.Types.ObjectId("000000000000000000000000").toHexString();
  }
}

export default Entity;
