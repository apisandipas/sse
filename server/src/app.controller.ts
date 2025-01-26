import { Controller, Sse, Body, Post, MessageEvent } from '@nestjs/common';
import { SettingsService } from './resources/settings/settings.service';
import { interval, map, Observable } from 'rxjs';

const generatePointCloud = () => {
  const points: number[] = [];
  const pointCount = 1500;
  const radius = 25;

  for (let i = 0; i < pointCount; i++) {
    const theta = Math.acos(2 * Math.random() - 1); // Polar angle
    const phi = 2 * Math.PI * Math.random(); // Azimuthal angle

    // Convert to Cartesian coordinates
    const x = radius * Math.sin(theta) * Math.cos(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(theta);
    points.push(x, y, z);
  }

  return points;
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
              value: setting?.value,
              time: Date.now(),
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
