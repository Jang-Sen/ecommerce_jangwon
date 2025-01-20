import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieService } from '@movie/movie.service';
import { MovieController } from '@movie/movie.controller';
import { Movie } from '@movie/entities/movie.entity';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { MovieResolver } from './movie.resolver';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Movie]), HttpModule],
  controllers: [MovieController],
  providers: [MovieService, MovieResolver],
})
export class MovieModule {}
