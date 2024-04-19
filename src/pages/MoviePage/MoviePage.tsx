import React from 'react';
import { Alert, Spin, Tabs } from 'antd';

import { createGuestSession, getGenres } from 'src/api/MoviesApi';
import MovieTab from 'src/components/MovieTab/MovieTab';
import RatedTab from 'src/components/RatedTab/RatedTab';
import { TGenre } from 'src/model/TGenre';
import { GuestSessionIdContext } from 'src/pages/MoviePage/GuestSessionIdContext';

import css from './MoviePage.module.scss';
import { GenresContext } from './GenresContext';
import { MovieRatingContext } from './MovieRatingContext';

export type MoviePageProps = object;
export type MoviePageState = {
  isLoading: boolean;
  isError: boolean;
  error: any;
  isInited: boolean;
  guestSessionId: string;
  genres: TGenre[];
  movieRating: {
    rating: Map<number, number>;
    setRating: (setRating: (ratingMap: Map<number, number>) => void) => void;
  };
  tabKey: string;
};

// search: string | null | Array<number|string>

class MoviePage extends React.Component<MoviePageProps, MoviePageState> {
  isloading = false;

  constructor(props: never) {
    super(props);
    this.state = {
      isLoading: false,
      isError: false,
      error: null,
      isInited: false,
      guestSessionId: '',
      genres: [],
      movieRating: {
        rating: new Map<number, number>(),
        setRating: (setRating: (ratingMap: Map<number, number>) => void) =>
          this.setState((prevState) => ({
            ...prevState,
            movieRating: (function () {
              setRating(prevState.movieRating.rating);
              return { ...prevState.movieRating };
            })(),
          })),
      },
      tabKey: 'Search',
    };
  }

  override componentDidMount() {
    this.initMoviesApp();
  }

  initMoviesApp = () => {
    if (!this.isloading) {
      this.setState({
        isLoading: true,
        isError: false,
        error: null,
      });
      this.isloading = true;

      (async () => {
        try {
          const [guestSessionId, genres] = await Promise.all([await createGuestSession(), await getGenres()]);
          this.setState({
            isInited: true,
            guestSessionId,
            genres,
          });
        } catch (ex) {
          console.error('error creating session or fetching genres', ex);
          this.setState({
            isError: true,
            error: ex,
          });
        } finally {
          this.setState({ isLoading: false });
          this.isloading = false;
        }
      })();
    }
  };

  override render() {
    const { isLoading, isError, error, isInited, guestSessionId, genres, movieRating, tabKey } = this.state;

    return (
      <>
        {isLoading && <Spin className={css.spinLoading} />}
        {isError &&
          (function () {
            if (['Failed to fetch', 'Network error'].includes(error.message))
              return <Alert type="error" message="Ошибка соединения с сервером, возможно проблема с интернетом" />;
            return <Alert type="error" message={`Неизвестная ошибка: ${error.message}`} />;
          })()}
        {isInited && (
          <GenresContext.Provider value={genres}>
            <MovieRatingContext.Provider value={movieRating}>
              <GuestSessionIdContext.Provider value={guestSessionId}>
                <Tabs
                  activeKey={tabKey}
                  onChange={(activeKey) => this.setState({ tabKey: activeKey })}
                  centered
                  items={[
                    {
                      key: 'Search',
                      label: `Search`,
                      children: <MovieTab />,
                    },
                    {
                      key: 'Rated',
                      label: `Rated`,
                      children: <RatedTab isTabSelected={tabKey === 'Rated'} />,
                    },
                  ]}
                />
              </GuestSessionIdContext.Provider>
            </MovieRatingContext.Provider>
          </GenresContext.Provider>
        )}
      </>
    );
  }
}

export default MoviePage;
