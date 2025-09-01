import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async onModuleInit(): Promise<void> {
    const admin = await this.repo.findOne({ where: { username: 'admin' } });
    if (!admin) {
      const u = this.repo.create({
        username: 'admin',
        password: 'admin123',
        role: 'admin',
      });
      await this.repo.save(u);
    }

    const normal = await this.repo.findOne({ where: { username: 'user' } });
    if (!normal) {
      const u2 = this.repo.create({
        username: 'user',
        password: 'user123',
        role: 'user',
      });
      await this.repo.save(u2);
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.repo.findOne({ where: { username } });
  }

  async findById(id: number): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  async create(username: string, password: string, role: 'admin' | 'user'): Promise<User> {
    const user = this.repo.create({ username, password, role });
    return this.repo.save(user);
  }
}
