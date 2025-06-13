import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { ProfilModule } from './profil/profil.module';
import { UpdatePasswordModule } from './updatePassword/updatePassword.module';

@Module({
  imports: [SupabaseModule, ProfilModule, UpdatePasswordModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
