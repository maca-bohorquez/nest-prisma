import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.RoleCreateInput) {
    return this.prisma.role.create({ data });
  }

  findAll() {
    return this.prisma.role.findMany();
  }

  findOne(id: number) {
    return this.prisma.role.findUnique({ where: { id } });
  }

  update(id: number, data: Prisma.RoleUpdateInput) {
    return this.prisma.role.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.role.delete({ where: { id } });
  }
}
