import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseAdmin } from './firebase.admin';

@Module({
  providers: [FirebaseAdmin],
  exports: [FirebaseAdmin],
  imports: [ConfigModule]
})
export class AdminModule {}
