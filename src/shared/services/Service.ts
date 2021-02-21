import Command from "@shared/messages/Command";
interface Service {
  execute(command: any | Command): any;
}

export default Service;
