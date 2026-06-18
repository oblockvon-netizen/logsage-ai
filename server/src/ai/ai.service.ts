import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AiService {
  constructor(private readonly configService: ConfigService) {}

  isOpenAiConfigured() {
    return Boolean(this.configService.get<string>("OPENAI_API_KEY"));
  }
}
