import { BadRequestException, Controller, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags
} from "@nestjs/swagger";
import { memoryStorage } from "multer";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { UuidParamPipe } from "../common/pipes/uuid-param.pipe";
import type { AuthUser } from "../auth/types/auth-user.type";
import { LogsService } from "./logs.service";

const allowedExtensions = new Set([".log", ".txt", ".csv"]);

@ApiTags("Logs")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("logs")
export class LogsController {
  constructor(
    private readonly logsService: LogsService,
    private readonly configService: ConfigService
  ) {}

  @Post("upload")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: memoryStorage(),
      limits: {
        fileSize: Number(process.env.MAX_UPLOAD_SIZE_MB ?? 10) * 1024 * 1024
      },
      fileFilter: (_request, file, callback) => {
        const extension = getExtension(file.originalname);
        if (!allowedExtensions.has(extension)) {
          callback(new BadRequestException("Unsupported file type. Upload .log, .txt, or .csv files only."), false);
          return;
        }

        callback(null, true);
      }
    })
  )
  @ApiOperation({ summary: "Upload a log file for the current user" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
          description: "Supported formats: .log, .txt, .csv"
        }
      },
      required: ["file"]
    }
  })
  @ApiCreatedResponse({ description: "Log file uploaded and raw content stored." })
  upload(@CurrentUser() user: AuthUser, @UploadedFile() file?: Express.Multer.File) {
    this.validateFile(file);
    return this.logsService.createFromUpload(user.id, file);
  }

  @Get()
  @ApiOperation({ summary: "List log files owned by the current user" })
  @ApiOkResponse({ description: "Current user log files returned." })
  findAll(@CurrentUser() user: AuthUser) {
    return this.logsService.findAllForUser(user.id);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get one log file owned by the current user" })
  @ApiParam({ name: "id", description: "Log file UUID" })
  @ApiOkResponse({ description: "Log file returned if owned by current user." })
  findOne(@CurrentUser() user: AuthUser, @Param("id", UuidParamPipe) id: string) {
    return this.logsService.findOneForUser(user.id, id);
  }

  private validateFile(file?: Express.Multer.File): asserts file is Express.Multer.File {
    if (!file) {
      throw new BadRequestException("A log file is required.");
    }

    const extension = getExtension(file.originalname);
    if (!allowedExtensions.has(extension)) {
      throw new BadRequestException("Unsupported file type. Upload .log, .txt, or .csv files only.");
    }

    const maxUploadSizeMb = this.configService.get<number>("MAX_UPLOAD_SIZE_MB", 10);
    const maxBytes = maxUploadSizeMb * 1024 * 1024;

    if (file.size <= 0) {
      throw new BadRequestException("Uploaded file cannot be empty.");
    }

    if (file.size > maxBytes) {
      throw new BadRequestException(`Uploaded file is too large. Maximum size is ${maxUploadSizeMb} MB.`);
    }

    if (!file.buffer || file.buffer.length === 0) {
      throw new BadRequestException("Uploaded file content could not be read.");
    }
  }
}

function getExtension(filename: string) {
  const index = filename.lastIndexOf(".");
  return index === -1 ? "" : filename.slice(index).toLowerCase();
}
