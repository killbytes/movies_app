import React from 'react';
import { Card, Flex, Rate } from 'antd';

import SkeletImg from 'src/assets/t6-k1xjf49Q.jpg';
import VoteAverage from 'src/components/MovieCard/VoteAverage';
import { TGenre } from 'src/model/TGenre';
import { TMovie } from 'src/model/TMovie';
import { GenresContext } from 'src/pages/MoviePage/GenresContext';

import css from './MovieCard.module.scss';

const cardStyle: React.CSSProperties = {
  width: 450,
  borderRadius: 8,
};

const imgStyle: React.CSSProperties = {
  display: 'flex',
  width: 180,
  height: 280,
};

export type MovieCardProps = {
  movie: TMovie;
};
export type MovieCardState = object;
// search: string | null | Array<number|string>

// Функция для сокращения текста
const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) {
    return text;
  }
  const truncatedText = text.substr(0, text.lastIndexOf(' ', maxLength));
  return `${truncatedText}...`;
};
const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

class MovieCard extends React.Component<MovieCardProps, MovieCardState> {
  static override contextType = GenresContext;

  private setValue: any;

  override render() {
    const { movie } = this.props;
    const genres = this.context as TGenre[];

    return (
      <Card
        size="small"
        key={movie.id}
        hoverable
        style={cardStyle}
        styles={{ body: { padding: 0, overflow: 'hidden' } }}
      >
        <Flex justify="space-between">
          <img
            alt="avatar"
            src={movie.poster_path ? `https://image.tmdb.org/t/p/original${movie.poster_path}` : SkeletImg}
            style={imgStyle}
          />

          <Flex
            vertical
            align="flex-start"
            justify="space-between"
            style={{ padding: 20, paddingTop: 7, justifyContent: undefined }}
          >
            <div className={css.cardInfoTop}>
              <h5 className={css.title}>{movie.title}</h5>

              <VoteAverage value={movie.vote_average} />
            </div>
            <time className={css.date}>2024</time>
            <div className={css.genres}>
              {movie.genre_ids.map((gId) => {
                const genre = genres.find((g) => g.id === gId);
                return (
                  <div key={gId} className={css.genre}>
                    {genre ? genre.name : 'Неизвестный жанр'}
                  </div>
                );
              })}
            </div>
            <div className={css.descriprions}>{truncateText(movie.overview, 100)}</div>
            <Flex gap="middle" vertical>
              <Rate tooltips={desc} onChange={this.setValue} value={3} count={10} />
              {/*{value ? <span>{desc[value - 1]}</span> : null}*/}
            </Flex>
          </Flex>
        </Flex>
      </Card>
    );
  }
}

export default MovieCard;
