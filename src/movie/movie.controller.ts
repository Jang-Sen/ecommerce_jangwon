import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';
import { MovieService } from '@movie/movie.service';
import { Movie } from '@movie/entities/movie.entity';

@ApiTags('Movie')
@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  @ApiOperation({ summary: '영화 등록' })
  async create(
    @Body('resource') resource: string,
    @Body('language') language?: string,
    @Body('page') page?: number,
  ): Promise<Movie[]> {
    return await this.movieService.createMovie(resource, language, page);
  }
}
