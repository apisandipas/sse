import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prismaService: PrismaService) {}

  async updateValue(name: string, value: string) {
    return await this.prismaService.setting.update({
      where: {
        name: name,
      },
      data: {
        value: value,
      },
    });
  }

  async getValue(name: string) {
    return await this.prismaService.setting.findFirst({ where: { name } });
  }
}
