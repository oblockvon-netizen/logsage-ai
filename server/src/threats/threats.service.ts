import { Injectable } from "@nestjs/common";

@Injectable()
export class ThreatsService {
  getModuleStatus() {
    return "Threats module ready for user-owned threat records.";
  }
}
