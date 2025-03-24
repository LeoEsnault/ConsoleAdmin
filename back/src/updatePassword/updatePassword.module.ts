import { SupabaseModule } from "../supabase/supabase.module";
import { Module } from "@nestjs/common";
import { UpdatePasswordService } from "./updatePassword.service";
import { UpdatePasswordController } from "./updatePassword.controller";

@Module({
  imports: [SupabaseModule],
  controllers: [UpdatePasswordController],
  providers: [UpdatePasswordService],
  exports: [UpdatePasswordService],
})
export class UpdatePasswordModule {}