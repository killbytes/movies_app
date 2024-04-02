import React from 'react';
import { Alert, Button, Card, Flex, Spin, Typography } from 'antd';

import { getMovies } from 'src/GetData';
import SkeletImg from 'src/assets/t6-k1xjf49Q.jpg';

import css from './MoviesList.module.scss';

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
};

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
            const moviePage = await getMovies('return');
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
  // private src: any;

  override render() {
    const { moviePage, isLoading, isError, error } = this.state;

    return (
      <div className={css.page}>
        <div>movies list</div>
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
                        ? `https://image.tmdb.org/t/p/original${JSON.stringify(movie.poster_path).replace(/^['"](.*)['"]$/, '$1')}`
                        : SkeletImg
                    }
                    style={imgStyle}
                  />

                  <Flex vertical align="flex-start" justify="space-between" style={{ padding: 20, paddingTop: 7 }}>
                    <Typography.Title level={3}>{JSON.stringify(movie.title)}</Typography.Title>

                    <Typography.Title level={4}>{truncateText(JSON.stringify(movie.overview), 100)}</Typography.Title>
                    <Button type="primary" href="https://ant.design" target="_blank">
                      Get Started
                    </Button>
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
