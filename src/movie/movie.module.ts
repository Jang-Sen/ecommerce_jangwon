import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieService } from '@movie/movie.service';
import { MovieController } from '@movie/movie.controller';
import { Movie } from '@movie/entities/movie.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Movie]), HttpModule],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
