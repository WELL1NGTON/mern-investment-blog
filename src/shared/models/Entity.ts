import IEntity from "./IEntity";
import mongoose from "mongoose";

class Entity implements IEntity {
  constructor() {
    const id = new mongoose.Types.ObjectId();
    this.id = id.toHexString();
    // this.id = mongoose.Types.ObjectId().toHexString();
  }
  id!: string;

  public removeId() {
    this.id = mongoose.Types.ObjectId("000000000000000000000000").toHexString();
  }
}

export default Entity;
