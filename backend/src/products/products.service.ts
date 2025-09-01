import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
  ) {}

  async findAll(page = 1, limit = 10) {
    const take = Math.min(limit, 100);
    const skip = (page - 1) * take;

    const [data, total] = await this.repo.findAndCount({
      skip,
      take,
      order: { id: 'ASC' },
    });

    return { data, total, page, limit: take };
  }

  async findOne(id: number) {
    const product = await this.repo.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  async create(dto: CreateProductDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async update(id: number, dto: UpdateProductDto) {
    const product = await this.repo.preload({ id, ...dto });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return this.repo.save(product);
  }

  async remove(id: number) {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return { deleted: true };
  }
}
