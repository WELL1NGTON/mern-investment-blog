import Command from "@shared/messages/Command";
abstract class Service {
  abstract execute(command: any): any;
}

export default Service;
