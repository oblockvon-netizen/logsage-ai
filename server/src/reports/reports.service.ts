import { Injectable } from "@nestjs/common";

@Injectable()
export class ReportsService {
  getModuleStatus() {
    return "Reports module ready for user-owned incident reports.";
  }
}
