import { SupabaseModule } from "../supabase/supabase.module";
import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { UsersFacade } from "./users.facade";

@Module({
  imports: [SupabaseModule],
  controllers: [UsersController],
  providers: [UsersService, UsersFacade],
  exports: [UsersService],
})
export class UsersModule {}