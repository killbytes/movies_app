import React from 'react';
import { Button, Card, Flex, Typography } from 'antd';

import { getMovies } from 'src/GetData';

import css from './MoviesList.module.scss';

const cardStyle: React.CSSProperties = {
  width: 620,
};

const imgStyle: React.CSSProperties = {
  display: 'block',
  width: 273,
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
};

class MovieList extends React.Component<MovieListProps, MovieListState> {
  isloading = false;

  constructor(props: never) {
    super(props);
    this.state = {
      moviePage: null,
      needToLoadMovies: true,
      isLoading: false,
    };
  }

  override componentDidMount() {
    this.loadMovies();
  }

  override componentDidUpdate(prevProps: Readonly<MovieListProps>, prevState: Readonly<MovieListState>) {
    console.log(
      'prevState.needToLoadMovies',
      prevState.needToLoadMovies,
      'this.state.needToLoadMovies',
      this.state.needToLoadMovies
    );
    if (prevState.needToLoadMovies !== this.state.needToLoadMovies) {
      this.loadMovies();
    }
  }

  loadMovies = () => {
    if (this.state.needToLoadMovies) {
      this.setState((prevState) => ({ ...prevState, needToLoadMovies: false }));
      if (!this.isloading) {
        this.setState((prevState) => ({ ...prevState, isLoading: true }));
        this.isloading = true;
        (async () => {
          try {
            const moviePage = await getMovies('return');
            this.setState((prevState) => ({ ...prevState, moviePage }));
          } catch (ex) {
            console.error('error fetching movies', ex);
          } finally {
            this.setState((prevState) => ({ ...prevState, isLoading: false }));
            this.isloading = false;
          }
        })();
      }
    }
  };

  override render() {
    const { moviePage, isLoading } = this.state;
    return (
      <div className={css.page}>
        <div>movies list</div>
        <button type="button" onClick={() => this.setState((prevState) => ({ ...prevState, needToLoadMovies: true }))}>
          reload list
        </button>
        <div>loading: {`${isLoading}`}</div>
        <div className="cards">
          {moviePage?.results.map((movie) => {
            return (
              // <div key={movie.id}>{JSON.stringify(movie)}</div>
              <Card key={movie.id} hoverable style={cardStyle} styles={{ body: { padding: 0, overflow: 'hidden' } }}>
                <Flex justify="space-between">
                  <img
                    alt="avatar"
                    src={`https://image.tmdb.org/t/p/original${JSON.stringify(movie.poster_path).replace(
                      /^['"](.*)['"]$/,
                      '$1'
                    )}`}
                    style={imgStyle}
                  />

                  <Flex vertical align="flex-end" justify="space-between" style={{ padding: 32 }}>
                    <Typography.Title level={3}>{JSON.stringify(movie.title)}</Typography.Title>

                    <Typography.Title level={4}>{JSON.stringify(movie.overview)}</Typography.Title>
                    <Button type="primary" href="https://ant.design" target="_blank">
                      Get Started
                    </Button>
                  </Flex>
                </Flex>
              </Card>
            );
          })}
        </div>
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
