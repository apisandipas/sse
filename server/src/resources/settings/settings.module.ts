import { SettingsService } from "./settings.service";
import { Module } from "@nestjs/common";
import { CommonModule } from "src/common/common.module";

@Module({
  imports: [CommonModule],
  controllers: [],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}