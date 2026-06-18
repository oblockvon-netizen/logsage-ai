import { Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { UuidParamPipe } from "../common/pipes/uuid-param.pipe";
import type { AuthUser } from "../auth/types/auth-user.type";
import { ReportsService } from "./reports.service";

@ApiTags("Reports")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("reports")
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post("generate/:logFileId")
  @ApiOperation({ summary: "Generate an incident report for a user-owned log file" })
  @ApiParam({ name: "logFileId", description: "Log file UUID" })
  @ApiCreatedResponse({ description: "Incident report generated and stored." })
  generate(@CurrentUser() user: AuthUser, @Param("logFileId", UuidParamPipe) logFileId: string) {
    return this.reportsService.generateForLogFile(user.id, logFileId);
  }

  @Get()
  @ApiOperation({ summary: "List reports owned by the current user" })
  @ApiOkResponse({ description: "Current user reports returned." })
  findAll(@CurrentUser() user: AuthUser) {
    return this.reportsService.findAllForUser(user.id);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get one report owned by the current user" })
  @ApiParam({ name: "id", description: "Report UUID" })
  @ApiOkResponse({ description: "Report returned if owned by current user." })
  findOne(@CurrentUser() user: AuthUser, @Param("id", UuidParamPipe) id: string) {
    return this.reportsService.findOneForUser(user.id, id);
  }
}
