import { SupabaseModule } from "../supabase/supabase.module";
import { Module } from "@nestjs/common";
import { ProfilService } from "./profil.service";
import { ProfilController } from "./profil.controller";
import { ProfilFacade } from "./profil.facade";

@Module({
  imports: [SupabaseModule],
  controllers: [ProfilController],
  providers: [ProfilService, ProfilFacade],
  exports: [ProfilService],
})
export class ProfilModule {}