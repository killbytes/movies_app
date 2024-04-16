import React from 'react';
import { Alert, Flex, Input, Pagination, Spin } from 'antd';
import _ from 'lodash';

import { getMovies } from 'src/api/MoviesApi';
import MovieCard from 'src/components/MovieCard/MovieCard';
import { TMovie } from 'src/model/TMovie';

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
  search: string;
  isTyping: boolean;
  page: number;
};
// search: string | null | Array<number|string>

class MovieTab extends React.Component<MovieTabProps, MovieTabState> {
  isLoading = false;

  constructor(props: any) {
    super(props);
    this.state = {
      moviePage: null,
      needToLoadMovies: true,
      isLoading: false,
      isError: false,
      error: null,
      search: '',
      isTyping: false,
      page: 1,
    };
  }

  override componentDidMount() {
    this.loadMovies();
  }

  override componentDidUpdate(prevProps: Readonly<MovieTabProps>, prevState: Readonly<MovieTabState>) {
    if (prevState.search !== this.state.search) {
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
      if (!this.isLoading) {
        this.setState((prevState) => ({
          ...prevState,
          isLoading: true,
          isError: false,
          error: null,
        }));
        this.isLoading = true;

        (async () => {
          try {
            const moviePage = await getMovies(this.state.search, this.state.page);
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
            this.isLoading = false;
          }
        })();
      }
    }
  };

  typeSearch = _.debounce(
    () =>
      this.setState({
        needToLoadMovies: true,
        isTyping: false,
      }),
    350
  );

  override render() {
    const { moviePage, isLoading, isError, error, search, isTyping } = this.state;

    return (
      <div className={css.page}>
        <Input
          value={this.state.search}
          onChange={(ev) =>
            this.setState({
              search: ev.currentTarget.value,
              isTyping: true,
            })
          }
          // this.typeSearch()
          placeholder="Type to search..."
        />

        <button type="button" style={{"display": "none"}} onClick={() => this.setState((prevState) => ({ ...prevState, needToLoadMovies: true }))}>
          reload list
        </button>
        {(isLoading || isTyping) && <Spin className={css.spinLoading} />}
        {isError &&
          (function () {
            if (['Failed to fetch', 'Network error'].includes(error.message))
              return <Alert type="error" message="Ошибка соединения с сервером, возможно проблема с интернетом" />;
            return <Alert type="error" message={`Неизвестная ошибка: ${error.message}`} />;
          })()}
        <Flex className={css.cards} gap="middle" wrap="wrap">
          {(function () {
            if (!isTyping && !isLoading) {
              if (moviePage) {
                if (!moviePage.total_results && !search) return <Alert message="Введите название фильма" type="info" />;
                if (!moviePage.total_results) return <Alert message="Не найдено" type="info" />;
                else
                  return moviePage.results.map((movie) => {
                    return <MovieCard key={movie.id} movie={movie} />;
                  });
              } else {
                if (!search) return <Alert message="Введите название фильма" type="info" />;
              }
            }
            return undefined;
          })()}
        </Flex>
        {moviePage && (
          <Pagination
            current={this.state.page}
            pageSize={20}
            total={moviePage.total_results}
            onChange={(page: number) => this.setState({ page })}
          />
        )}
      </div>
    );
  }
}

export default MovieTab;
