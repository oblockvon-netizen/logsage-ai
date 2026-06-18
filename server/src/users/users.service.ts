import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersService {
  getModuleStatus() {
    return "Users module ready for normal user accounts.";
  }
}
