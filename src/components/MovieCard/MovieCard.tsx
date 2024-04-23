import React from 'react';
import { Card, Flex, Rate } from 'antd';

import { addRating, deleteRating } from 'src/api/MoviesApi';
import { format, parseISO } from 'date-fns';
import SkeletImg from 'src/assets/t6-k1xjf49Q.jpg';
import VoteAverage from 'src/components/MovieCard/VoteAverage';
import { TMovie } from 'src/model/TMovie';
import { GenresContext } from 'src/pages/MoviePage/GenresContext';
import { GuestSessionIdContext } from 'src/pages/MoviePage/GuestSessionIdContext';
import { MovieRatingContext } from 'src/pages/MoviePage/MovieRatingContext';

import css from './MovieCard.module.scss';

const cardStyle: React.CSSProperties = {
  maxWidth: 450,
  borderRadius: 8,
};

const imgStyle: React.CSSProperties = {}
// const imgStyle: React.CSSProperties = {
//   display: 'flex',
//   width: 180,
//   height: 280
// };

export type MovieCardProps = {
  movie: TMovie;
};
export type MovieCardState = {
  rating: number;
};
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
  //static override contextType = MovieRatingContext;

  constructor(props: any) {
    super(props);
    this.state = {
      rating: 0,
    };
  }

  override render() {
    const { movie } = this.props;

    const formattedDate = movie.release_date ? format(parseISO(movie.release_date), 'MMMM d, yyyy') : '';

    return (
      <GenresContext.Consumer>
        {(genres) => (
          <MovieRatingContext.Consumer>
            {({ rating, setRating }) => (
              <GuestSessionIdContext.Consumer>
                {(guestSessionId) => (
                  <Card
                    className = {css.card}
                    size="small"
                    key={movie.id}
                    hoverable
                    style={cardStyle}
                    styles={{ body: { padding: 0, overflow: 'hidden' } }}
                  >
                    <Flex justify="space-between">
                      <img
                        className={css.img}
                        alt="avatar"
                        src={movie.poster_path ? `https://image.tmdb.org/t/p/original${movie.poster_path}` : SkeletImg}
                        style={{...imgStyle}}
                      />
                      <Flex
                        className={css.contentRight}
                        vertical
                        align="flex-start"
                        justify="space-between"
                        // style={{ padding: 20, paddingTop: 7, justifyContent: undefined }}
                      >
                        <div className={css.cardInfoTop}>
                          <h5 className={css.title}>{movie.title}</h5>
                          <VoteAverage value={movie.vote_average} />
                        </div>
                        <time className={css.date}>{formattedDate}</time>
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
                        <div className={css.descriptions}>{truncateText(movie.overview, 100)}</div>
                        <Flex gap="middle" vertical className={css.rateFlex}>
                          <Rate
                            className={css.rate}
                            onChange={(rating) => {
                              setRating((prev) => prev.set(movie.id, rating));

                              (async () => {
                                if (rating > 0) {
                                  await addRating(movie.id, guestSessionId, rating);
                                  setRating((prev) => prev.set(movie.id, rating));
                                } else {
                                  await deleteRating(movie.id, guestSessionId);
                                  setRating((prev) => prev.set(movie.id, rating));
                                }
                              })();
                            }}
                            value={rating.get(movie.id) ?? 0}
                            count={10}
                            allowHalf
                            style={{ fontSize: 18 }}
                          />
                        </Flex>
                      </Flex>
                    </Flex>
                  </Card>
                )}
              </GuestSessionIdContext.Consumer>
            )}
          </MovieRatingContext.Consumer>
        )}
      </GenresContext.Consumer>
    );
  }
}

export default MovieCard;
