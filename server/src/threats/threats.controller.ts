import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { UuidParamPipe } from "../common/pipes/uuid-param.pipe";
import type { AuthUser } from "../auth/types/auth-user.type";
import { ThreatsService } from "./threats.service";

@ApiTags("Threats")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("threats")
export class ThreatsController {
  constructor(private readonly threatsService: ThreatsService) {}

  @Get()
  @ApiOperation({ summary: "List threats owned by the current user" })
  @ApiOkResponse({ description: "Current user threats returned." })
  findAll(@CurrentUser() user: AuthUser) {
    return this.threatsService.findAllForUser(user.id);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get one threat owned by the current user" })
  @ApiParam({ name: "id", description: "Threat UUID" })
  @ApiOkResponse({ description: "Threat returned if owned by current user." })
  findOne(@CurrentUser() user: AuthUser, @Param("id", UuidParamPipe) id: string) {
    return this.threatsService.findOneForUser(user.id, id);
  }
}
