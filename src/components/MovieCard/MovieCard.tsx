import React from 'react';
import {Card, Flex } from 'antd';
import SkeletImg from 'src/assets/t6-k1xjf49Q.jpg';
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

export type TMovie = {
  id: number;
  poster_path: string;
  title: string;
  overview: string;
};

export type MovieCardProps = {
  movie: TMovie
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

class MovieCard extends React.Component<MovieCardProps, MovieCardState> {

  override render() {
    const {movie} = this.props;

    return (
      <Card
        size="small"
        key={movie.id}
        hoverable
        style={cardStyle}
        styles={{body: {padding: 0, overflow: 'hidden'}}}
      >
        <Flex justify="space-between">
          <img
            alt="avatar"
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
                : SkeletImg
            }
            style={imgStyle}
          />

          <Flex vertical align="flex-start" justify="space-between"
                style={{padding: 20, paddingTop: 7, justifyContent: undefined}}>
            <div className={css.cardInfoTop}>
              <h5 className={css.title}>{movie.title}</h5>
              <div className={css.rating}>5</div>
            </div>
            <time className={css.date}>2024</time>
            <div className={css.genres}>
              <div className={css.genre}>Action</div>
              <div className={css.genre}>Drama</div>
            </div>
            <div className={css.descriprions}>{truncateText(movie.overview, 100)}</div>
          </Flex>
        </Flex>
      </Card>
    )
      ;
  }
}

export default MovieCard;
