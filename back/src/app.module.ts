import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { ProfilModule } from './profil/profil.module';
import { UpdatePasswordModule } from './updatePassword/updatePassword.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [SupabaseModule, ProfilModule, UpdatePasswordModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
