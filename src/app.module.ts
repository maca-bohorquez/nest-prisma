import { Module } from '@nestjs/common';

import { CoreModule } from './core/core.module';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/gaurds/auth.gaurd';
import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [
    CoreModule,
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '12h' },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
