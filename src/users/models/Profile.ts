import Entity from '@shared/models/Entity';

class Profile extends Entity {
  name!: string;
  about?: string;
  profileImage?: string;
  contact?: [string, string][];

  constructor(
    name: string,
    about?: string,
    profileImage?: string,
    contact?: [string, string][]
  ) {
    super();
    this.name = name;
    this.about = about;
    this.profileImage = profileImage;
    this.contact = contact;
  }

  public toJSON(){
    return {
      id: this.id,
      name: this.name,
      about: this.about,
      profileImage:this.profileImage,
      contact: this.contact
    }
  }
}

export default Profile;
