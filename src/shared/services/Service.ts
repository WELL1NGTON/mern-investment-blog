import Command from "@shared/messages/Command";
abstract class Service {
  abstract execute(command: any | Command): any;
}

export default Service;
