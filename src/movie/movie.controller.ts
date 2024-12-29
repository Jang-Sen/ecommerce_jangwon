import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';
import { MovieService } from '@movie/movie.service';
import { Movie } from '@movie/entities/movie.entity';
import { MovieUrlDto } from '@movie/dto/movie-url.dto';

@ApiTags('Movie')
@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  @ApiOperation({ summary: '영화 등록' })
  async create(@Body() dto: MovieUrlDto): Promise<Movie[]> {
    const { resource, language, page } = dto;
    return await this.movieService.createMovie(resource, language, page);
  }
}
