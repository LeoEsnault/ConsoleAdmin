import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { UserModule } from './user/user.module';
import { EnterpriseModule } from './enterprise/enterprise.module';
import { ProfilModule } from './profil/profil.module';
import { EstablishmentModule } from './establishment/establishment.module';

@Module({
  imports: [SupabaseModule, UserModule, EnterpriseModule, ProfilModule, EstablishmentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
