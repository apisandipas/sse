import { DynamicModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SettingsModule } from './resources/settings/settings.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

const imports: DynamicModule[] = [];

if (process.env.NODE_ENV === 'production') {
  imports.push(
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  );
}

@Module({
  imports: [...imports, SettingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
