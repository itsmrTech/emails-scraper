import { Module } from "@nestjs/common";
import { ScrubController } from "./scrub.controller";

@Module({
  imports: [],
  controllers: [ScrubController],
  providers: []
})
export class MockModule {}