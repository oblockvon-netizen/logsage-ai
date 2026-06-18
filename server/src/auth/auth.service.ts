import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService {
  getModuleStatus() {
    return "Auth module ready for user-only JWT authentication.";
  }
}
