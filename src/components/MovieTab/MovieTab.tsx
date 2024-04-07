import React from 'react';
import { Alert, Flex, Input, Pagination, Spin } from 'antd';
import _ from 'lodash';

import { getMovies } from 'src/api/GetData';
import MovieCard, { TMovie } from 'src/components/MovieCard/MovieCard';

import css from './MovieTab.module.scss';

export type TMoviePage = {
  page: number;
  results: TMovie[];
  total_results: number;
};

export type MovieTabProps = object;
export type MovieTabState = {
  moviePage: null | TMoviePage;
  needToLoadMovies: boolean;
  isLoading: boolean;
  isError: boolean;
  error: any;
  inputSearchText: string;
  page: number;
};
// search: string | null | Array<number|string>

class MovieTab extends React.Component<MovieTabProps, MovieTabState> {
  isloading = false;

  constructor(props: any) {
    super(props);
    this.state = {
      moviePage: null,
      needToLoadMovies: true,
      isLoading: false,
      isError: false,
      error: null,
      inputSearchText: '',
      page: 1,
    };
  }

  override componentDidMount() {
    this.loadMovies();
  }

  override componentDidUpdate(prevProps: Readonly<MovieTabProps>, prevState: Readonly<MovieTabState>) {
    if (prevState.inputSearchText !== this.state.inputSearchText) {
      this.typeSearch();
    }
    if (prevState.page !== this.state.page) {
      this.setState({
        needToLoadMovies: true,
      });
    }

    if (prevState.needToLoadMovies !== this.state.needToLoadMovies) {
      this.loadMovies();
    }
  }

  loadMovies = () => {
    if (this.state.needToLoadMovies) {
      this.setState((prevState) => ({ ...prevState, needToLoadMovies: false }));
      if (!this.isloading) {
        this.setState((prevState) => ({
          ...prevState,
          isLoading: true,
          isError: false,
          error: null,
        }));
        this.isloading = true;

        (async () => {
          try {
            const moviePage = await getMovies(this.state.inputSearchText, this.state.page);
            this.setState((prevState) => ({ ...prevState, moviePage }));
          } catch (ex) {
            console.error('error fetching movies', ex);
            this.setState((prevState) => ({
              ...prevState,
              isError: true,
              error: ex,
            }));
          } finally {
            this.setState((prevState) => ({ ...prevState, isLoading: false }));
            this.isloading = false;
          }
        })();
      }
    }
  };

  typeSearch = _.debounce(
    () =>
      this.setState({
        needToLoadMovies: true,
      }),
    350
  );

  override render() {
    const { moviePage, isLoading, isError, error } = this.state;

    return (
      <div className={css.page}>
        <Input
          value={this.state.inputSearchText}
          onChange={(ev) =>
            this.setState({
              inputSearchText: ev.currentTarget.value,
            })
          }
          // this.typeSearch()
          placeholder="Type to search..."
        />

        <button type="button" onClick={() => this.setState((prevState) => ({ ...prevState, needToLoadMovies: true }))}>
          reload list
        </button>
        {isLoading && <Spin />}
        {isError &&
          (function () {
            if (['Failed to fetch', 'Network error'].includes(error.message))
              return <Alert type="error" message="Ошибка соединения с сервером, возможно проблема с интернетом" />;
            return <Alert type="error" message={`Неизвестная ошибка: ${error.message}`} />;
          })()}
        <Flex className={css.cards} gap="middle" wrap="wrap">
          {(function () {
            if (moviePage && !isLoading) {
              if (moviePage.total_results)
                return moviePage.results.map((movie) => {
                  return <MovieCard key={movie.id} movie={movie} />;
                });

              return 'Не найдено';
            }
          })()}
        </Flex>
        {this.state.moviePage && (
          <Pagination
            current={this.state.page}
            pageSize={20}
            total={this.state.moviePage.total_results}
            onChange={(page: number) => this.setState({ page })}
          />
        )}
      </div>
    );
  }
}

export default MovieTab;
