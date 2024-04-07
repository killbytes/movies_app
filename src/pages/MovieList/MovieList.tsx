import React from 'react';
import { Alert, Card, Flex, Spin, Input } from 'antd';
import _ from "lodash";

import { getMovies } from 'src/api/GetData';
import SkeletImg from 'src/assets/t6-k1xjf49Q.jpg';

import css from 'src/pages/MovieList/MoviesList.module.scss';

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
export type TMoviePage = {
  page: number;
  results: TMovie[];
};

export type MovieListProps = object;
export type MovieListState = {
  moviePage: null | TMoviePage;
  needToLoadMovies: boolean;
  isLoading: boolean;
  isError: boolean;
  error: any;
  search: string
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

class MovieList extends React.Component<MovieListProps, MovieListState> {
  isloading = false;

  constructor(props: never) {
    super(props);
    this.state = {
      moviePage: null,
      needToLoadMovies: true,
      isLoading: false,
      isError: false,
      error: null,
      search: ''
    };
  }

  override componentDidMount() {
    this.loadMovies();
  }

  override componentDidUpdate(prevProps: Readonly<MovieListProps>, prevState: Readonly<MovieListState>) {
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
            const moviePage = await getMovies(this.state.search);
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

  typeSearch = (text: string) => {
    _.debounce( () => this.setState(
      prevState => ({
        ...prevState, needToLoadMovies: true, search: text
      })
    ), 350);
  }

  override render() {
    const { moviePage, isLoading, isError, error } = this.state;

    return (
      <div className={css.page}>

        <Input
          value = {this.state.search}
          onChange = {ev => this.typeSearch(ev.currentTarget.value)}
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
          {moviePage?.results.map((movie) => {
            return (
              // <div key={movie.id}>{JSON.stringify(movie)}</div>
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
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
                        : SkeletImg
                    }
                    style={imgStyle}
                  />

                  <Flex vertical align="flex-start" justify="space-between" style={{ padding: 20, paddingTop: 7, justifyContent: undefined }}>
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
            );
          })}
        </Flex>
      </div>
    );
  }
}

export default MovieList;

/*
export function MovieListFun() {
  const [moviePage, setMoviePage] = useState(null as null | TMoviePage);
  const [needToLoadMovies, setNeedToLoadMovies] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    if (needToLoadMovies) {
      setNeedToLoadMovies(false);
      if (!isLoadingRef.current) {
        setIsLoading(true);
        isLoadingRef.current = true;

        (async () => {
          try {
            const movies = await getMovies('return');
            setMoviePage(movies);
          } catch (ex) {
            console.error('error fetching movies', ex);
          } finally {
            setIsLoading(false);
            isLoadingRef.current = false;
          }
        })();
      }
    }
  }, [needToLoadMovies]);

  return (
    <div className={css.page}>
      <div>movies list</div>
      <button type="button" onClick={() => setNeedToLoadMovies(true)}>
        reload list
      </button>
      <div>loading: {`${isLoading}`}</div>
      {moviePage?.results.map((movie) => <div key={movie.id}>{JSON.stringify(movie)}</div>)}
    </div>
  );
}
*/
