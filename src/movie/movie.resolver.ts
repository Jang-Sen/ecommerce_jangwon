import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Movie } from '@movie/entities/movie.entity';
import { MovieService } from '@movie/movie.service';
import { CreateMovieDto } from '@movie/dto/create-movie.dto';

@Resolver(() => Movie)
export class MovieResolver {
  constructor(private readonly movieService: MovieService) {}

  // 불러오기
  @Query(() => [Movie])
  async getMovie(): Promise<Movie[]> {
    return await this.movieService.getAllMovie();
  }

  @Query(() => Movie)
  async getMovieById(
    @Args('id', { type: () => String }) id: string,
  ): Promise<Movie> {
    return await this.movieService.getMovieById(id);
  }

  // 등록
  @Mutation(() => Movie)
  async createMovieByMe(
    @Args('createMovieDto') createMovieDto: CreateMovieDto,
    // adult: boolean,
    // poster_path: string,
    // genre_ids: number[],
    // mid: number,
    // original_language: string,
    // original_title: string,
    // overview: string,
    // popularity: number,
  ): Promise<Movie> {
    return await this.movieService.createMovieByMe(
      createMovieDto,
      // adult,
      // poster_path,
      // genre_ids,
      // mid,
      // original_language,
      // original_title,
      // overview,
      // popularity,
    );
  }

  @Mutation(() => [Movie])
  async createMovieByTMDB(
    // @Args('movieUrlDto') movieUrlDto: MovieUrlDto,
    @Args('resource') resource: string,
    @Args('language') language: string,
    @Args('page') page: number,
  ): Promise<Movie[]> {
    return await this.movieService.createMovieByTMDB(resource, language, page);
  }
}
