import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { Movie } from '@movie/entities/movie.entity';
import { ConfigService } from '@nestjs/config';
import { CreateMovieDto } from '@movie/dto/create-movie.dto';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly repository: Repository<Movie>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  // 조회
  async getAllMovie() {
    return await this.repository.find();
  }

  // ID로 찾기
  async getMovieById(id: string): Promise<Movie> {
    const movie = await this.repository.findOneBy({ id });

    if (!movie) {
      throw new NotFoundException('Not Found Movie');
    }

    return movie;
  }

  // 삭제
  async deleteMovie(id: string): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }

  async createMovieByMe(
    createMovieDto: CreateMovieDto,
    // adult: boolean,
    // poster_path: string,
    // genre_ids: number[],
    // mid: number,
    // original_language: string,
    // original_title: string,
    // overview: string,
    // popularity: number,
  ): Promise<Movie> {
    const movie = this.repository.create(
      createMovieDto,
      // {
      // adult,
      // poster_path,
      // genre_ids,
      // mid,
      // original_language,
      // original_title,
      // overview,
      // popularity,
      // }
    );

    return await this.repository.save(movie);
  }

  // 등록
  // @Cron('0 0 12 1 * ?')
  async createMovieByTMDB(
    resource: string,
    language?: string,
    page?: number,
  ): Promise<Movie[]> {
    const url = this.configService.get('MOVIE_URL');
    const movieToken = this.configService.get('MOVIE_TOKEN');

    const tmdbUrl = url + `${resource}?language=${language}&page=${page}`;
    const config = {
      headers: {
        Authorization: `Bearer ${movieToken}`,
      },
    };

    const { data, status } = await this.httpService
      .get(tmdbUrl, config)
      .toPromise();

    if (status === 200) {
      const datas = data.results;
      const movieDatas = [];

      datas?.map((data) =>
        movieDatas.push({
          adult: data['adult'],
          poster_path: 'https://image.tmdb.org/t/p/w500' + data['poster_path'],
          genre_ids: data['genre_ids'],
          mid: data['id'],
          original_language: data['original_language'],
          original_title: data['original_title'],
          overview: data['overview'],
          popularity: data['popularity'],
        }),
      );
      console.log('sss');
      return await this.repository.save(movieDatas);
    }
  }
}
