import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AiModule } from "./ai/ai.module";
import { AnalysisModule } from "./analysis/analysis.module";
import { AuthModule } from "./auth/auth.module";
import { validateEnvironment } from "./config/env.validation";
import { jwtConfig } from "./config/jwt.config";
import { LogsModule } from "./logs/logs.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ReportsModule } from "./reports/reports.module";
import { ThreatsModule } from "./threats/threats.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", "../.env"],
      load: [jwtConfig],
      validate: validateEnvironment
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    LogsModule,
    ThreatsModule,
    ReportsModule,
    AnalysisModule,
    AiModule
  ]
})
export class AppModule {}
