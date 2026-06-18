import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class LogsService {
  constructor(private readonly prisma: PrismaService) {}

  async createFromUpload(userId: string, file: Express.Multer.File) {
    const rawContent = readBufferSafely(file.buffer);
    const logFile = await this.prisma.logFile.create({
      data: {
        userId,
        filename: file.originalname,
        fileType: getExtension(file.originalname),
        rawContent
      },
      select: logFileSelect
    });

    return { logFile };
  }

  async findAllForUser(userId: string) {
    const logFiles = await this.prisma.logFile.findMany({
      where: { userId },
      orderBy: { uploadedAt: "desc" },
      select: {
        ...logFileSelect,
        rawContent: false
      }
    });

    return { logFiles };
  }

  async findOneForUser(userId: string, id: string) {
    const logFile = await this.prisma.logFile.findFirst({
      where: { id, userId },
      select: logFileSelect
    });

    if (!logFile) {
      throw new NotFoundException("Log file not found.");
    }

    return { logFile };
  }
}

const logFileSelect = {
  id: true,
  userId: true,
  filename: true,
  fileType: true,
  rawContent: true,
  uploadedAt: true
} as const;

function readBufferSafely(buffer: Buffer) {
  return buffer.toString("utf8").replace(/\u0000/g, "");
}

function getExtension(filename: string) {
  const index = filename.lastIndexOf(".");
  return index === -1 ? "" : filename.slice(index).toLowerCase();
}
