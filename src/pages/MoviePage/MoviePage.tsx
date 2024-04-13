import React from 'react';
import { Alert, Spin, Tabs } from 'antd';

import { createGuestSession, getGenres } from 'src/api/MoviesApi';
import MovieTab from 'src/components/MovieTab/MovieTab';
import RatedTab from 'src/components/RatedTab/RatedTab';
import { TGenre } from 'src/model/TGenre';

import css from './MoviePage.module.scss';
import { GenresContext } from './GenresContext';

export type MoviePageProps = object;
export type MoviePageState = {
  isLoading: boolean;
  isError: boolean;
  error: any;
  isInited: boolean;
  genres: TGenre[];
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
      genres: [],
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
          const [, genres] = await Promise.all([await createGuestSession(), await getGenres()]);
          this.setState({
            isInited: true,
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
    const { isLoading, isError, error, isInited, genres } = this.state;

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
            <Tabs
              defaultActiveKey="1"
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
                  children: <RatedTab />,
                },
              ]}
            />
          </GenresContext.Provider>
        )}
      </>
    );
  }
}

export default MoviePage;
