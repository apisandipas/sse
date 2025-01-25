import { Controller, Sse, Body, Post, MessageEvent } from '@nestjs/common';
import { SettingsService } from './resources/settings/settings.service';
import { interval, map, Observable } from 'rxjs';

const generateRGBColor = () => {
  const r = Math.floor(Math.random() * 256); // Random value between 0-255
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r},${g},${b})`;
};
const generatePointCloud = () => {
  return Array.from({ length: 500 }, () => ({
    x: Math.random() * 10 - 5,
    y: Math.random() * 10 - 5,
    z: Math.random() * 10 - 5,
    color: generateRGBColor(),
  }));
};

@Controller()
export class AppController {
  constructor(private settingsService: SettingsService) {}

  @Sse('sse')
  async sse(): Promise<Observable<MessageEvent>> {
    const setting = await this.settingsService.getValue('First Name');

    return interval(1000).pipe(
      map(
        (_) =>
          ({
            data: {
              points: generatePointCloud(),
              hello: `${setting?.value} @ ${Date.now()}`,
            },
          }) as MessageEvent,
      ),
    );
  }

  @Post('update')
  async updateDb(
    @Body('name') name: string,
    @Body('value') value: string,
  ): Promise<{ success: boolean }> {
    await this.settingsService.updateValue(name, value);
    return Promise.resolve({ success: true });
  }
}
