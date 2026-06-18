import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { MulterError } from "multer";
import type { Request, Response } from "express";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof MulterError
        ? HttpStatus.BAD_REQUEST
        : exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : null;

    const message =
      exception instanceof MulterError
        ? formatMulterError(exception)
        :
      typeof exceptionResponse === "object" && exceptionResponse !== null && "message" in exceptionResponse
        ? (exceptionResponse as { message: string | string[] }).message
        : exception instanceof Error
          ? exception.message
          : "Internal server error";

    response.status(status).json({
      statusCode: status,
      message: Array.isArray(message) ? message.join(", ") : message,
      path: request.url,
      timestamp: new Date().toISOString()
    });
  }
}

function formatMulterError(error: MulterError) {
  if (error.code === "LIMIT_FILE_SIZE") {
    return "Uploaded file is too large.";
  }

  if (error.code === "LIMIT_UNEXPECTED_FILE") {
    return "Unexpected file field. Use the field name \"file\".";
  }

  return "File upload failed.";
}
