import { Field, Float, InputType } from '@nestjs/graphql';

@InputType()
export class CreateMovieDto {
  @Field()
  adult: boolean;

  @Field()
  poster_path: string;

  @Field(() => [Number])
  genre_ids: number[];

  @Field()
  mid: number;

  @Field()
  original_language: string;

  @Field()
  original_title: string;

  @Field()
  overview: string;

  @Field(() => Float)
  popularity: number;
}
