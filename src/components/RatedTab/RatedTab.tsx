import React from 'react';
import { Alert, Flex, Pagination, Spin } from 'antd';

import { getRatedMovies } from 'src/api/MoviesApi';
import MovieCard from 'src/components/MovieCard/MovieCard';
import { TMovie } from 'src/model/TMovie';
import { GuestSessionIdContext } from 'src/pages/MoviePage/GuestSessionIdContext';

import css from './RatedTab.module.scss';

export type TMoviePage = {
  page: number;
  results: TMovie[];
  total_results: number;
};

export type RatedTabProps = {
  isTabSelected: boolean;
};
export type RatedTabState = {
  moviePage: null | TMoviePage;
  needToLoadMovies: boolean;
  isLoading: boolean;
  isError: boolean;
  error: any;
  page: number;
};
// search: string | null | Array<number|string>

class RatedTab extends React.Component<RatedTabProps, RatedTabState> {
  static override contextType = GuestSessionIdContext;

  isLoading = false;

  constructor(props: any) {
    super(props);
    this.state = {
      moviePage: null,
      needToLoadMovies: true,
      isLoading: false,
      isError: false,
      error: null,
      page: 1,
    };
  }

  override componentDidMount() {
    this.loadMovies();
  }

  override componentDidUpdate(prevProps: Readonly<RatedTabProps>, prevState: Readonly<RatedTabState>) {
    if (prevState.page !== this.state.page) {
      this.setState({ needToLoadMovies: true });
    }
    if (prevProps.isTabSelected !== this.props.isTabSelected && this.props.isTabSelected) {
      this.setState({ needToLoadMovies: true });
    }

    if (prevState.needToLoadMovies !== this.state.needToLoadMovies) {
      this.loadMovies();
    }
  }

  loadMovies = () => {
    if (this.state.needToLoadMovies) {
      this.setState((prevState) => ({ ...prevState, needToLoadMovies: false }));
      if (!this.isLoading) {
        this.setState((prevState) => ({
          ...prevState,
          isLoading: true,
          isError: false,
          error: null,
        }));
        this.isLoading = true;

        const { page } = this.state;
        const sessionId = this.context as string;
        (async () => {
          try {
            const moviePage = await getRatedMovies(sessionId, page);
            this.setState({ moviePage });
          } catch (ex) {
            console.error('error fetching movies', ex);
            this.setState((prevState) => ({
              ...prevState,
              isError: true,
              error: ex,
            }));
          } finally {
            this.setState((prevState) => ({ ...prevState, isLoading: false }));
            this.isLoading = false;
          }
        })();
      }
    }
  };

  override render() {
    const { moviePage, isLoading, isError, error } = this.state;

    return (
      <div className={css.page}>
        {isLoading && <Spin className={css.spinLoading} />}
        {isError &&
          (function () {
            if (['Failed to fetch', 'Network error'].includes(error.message))
              return <Alert type="error" message="Ошибка соединения с сервером, возможно проблема с интернетом" />;
            return <Alert type="error" message={`Неизвестная ошибка: ${error.message}`} />;
          })()}
        <Flex className={css.cards} gap="middle" wrap="wrap">
          {(function () {
            if (!isLoading) {
              if (moviePage) {
                if (!moviePage.total_results) return <Alert message="Не найдено" type="info" />;
                else
                  return moviePage.results.map((movie) => {
                    return <MovieCard key={movie.id} movie={movie} />;
                  });
              }
            }
            return undefined;
          })()}
        </Flex>
        {moviePage && moviePage.total_results > 20 && (
          <Pagination
            current={this.state.page}
            pageSize={20}
            total={moviePage.total_results}
            onChange={(page: number) => this.setState({ page })}
          />
        )}
        {/* <TriggerRerenderWhenContextChanged triggerLoadMovies={this.triggerLoadMovies} /> */}
      </div>
    );
  }
}

export default RatedTab;
