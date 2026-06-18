import { Controller, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { UuidParamPipe } from "../common/pipes/uuid-param.pipe";
import type { AuthUser } from "../auth/types/auth-user.type";
import { AnalysisService } from "./analysis.service";

@ApiTags("Analysis")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("analysis")
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Post("analyze/:logFileId")
  @ApiOperation({ summary: "Analyze a user-owned log file and store detected threats" })
  @ApiParam({ name: "logFileId", description: "Log file UUID" })
  @ApiOkResponse({ description: "Detected threats stored and returned with AI or fallback explanations." })
  analyze(@CurrentUser() user: AuthUser, @Param("logFileId", UuidParamPipe) logFileId: string) {
    return this.analysisService.analyzeLogFile(user.id, logFileId);
  }
}
