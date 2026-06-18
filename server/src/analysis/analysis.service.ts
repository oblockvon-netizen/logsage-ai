import { Injectable } from "@nestjs/common";

@Injectable()
export class AnalysisService {
  getModuleStatus() {
    return "Analysis module ready for log threat detection workflows.";
  }
}
