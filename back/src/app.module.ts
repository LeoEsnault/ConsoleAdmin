import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SupabaseModule } from "./supabase/supabase.module";
import { UserModule } from "./user/user.module";
import { ProfilModule } from "./profil/profil.module";

@Module({
  imports: [SupabaseModule, UserModule, ProfilModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
