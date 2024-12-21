import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { Movie } from '@movie/entities/movie.entity';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly repository: Repository<Movie>,
    private readonly httpService: HttpService,
  ) {}

  // 등록
  // @Cron('* * * * * *')
  async createMovie(): Promise<Movie[]> {
    const tmdbUrl =
      'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1';
    const config = {
      headers: {
        Authorization:
          'Bearer ' +
          'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NGViZDk0ZmRhMzJlYzQyNzBhNmZmNmFmNjVmMjhhNyIsIm5iZiI6MTczNDMyMTI0OC42NDUsInN1YiI6IjY3NWZhNDYwZDZmNWU4NDU4YjhiNTIyZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.gUmfYe6Z_3BgLytSw5hCaTBw1CXKG6tRvB9rLTVQVWk',
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
          backdrop_path: data['backdrop_path'],
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
