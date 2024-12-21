import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { Movie } from '@movie/entities/movie.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly repository: Repository<Movie>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  // 등록
  // @Cron('* * * * * *')
  async createMovie(
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
