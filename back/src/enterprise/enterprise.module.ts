import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { EnterpriseService } from './enterprise.service';
import { EnterpriseController } from './enterprise.controller';

@Module({
  imports: [SupabaseModule],
  controllers: [EnterpriseController],
  providers: [EnterpriseService],
  exports: [EnterpriseService],
})
export class EnterpriseModule {}
