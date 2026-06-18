import { Injectable } from "@nestjs/common";

@Injectable()
export class LogsService {
  getModuleStatus() {
    return "Logs module ready for user-owned log uploads.";
  }
}
