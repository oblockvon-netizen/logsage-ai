import { Module } from "@nestjs/common";
import { ThreatsService } from "./threats.service";

@Module({
  providers: [ThreatsService],
  exports: [ThreatsService]
})
export class ThreatsModule {}
