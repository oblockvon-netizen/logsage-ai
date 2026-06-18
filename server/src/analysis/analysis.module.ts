import { Module } from "@nestjs/common";
import { AiModule } from "../ai/ai.module";
import { AnalysisController } from "./analysis.controller";
import { AnalysisService } from "./analysis.service";

@Module({
  imports: [AiModule],
  controllers: [AnalysisController],
  providers: [AnalysisService],
  exports: [AnalysisService]
})
export class AnalysisModule {}
