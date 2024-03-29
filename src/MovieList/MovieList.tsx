import React from 'react';

import { getMovies } from 'src/GetData';

import css from './MoviesList.module.scss';


import { Button, Card, Flex, Typography } from 'antd';

const cardStyle: React.CSSProperties = {
  width: 620,
};

const imgStyle: React.CSSProperties = {
  display: 'block',
  width: 273,
};


export type TMovie = {
  id: number;
};
export type TMoviePage = {
  page: number;
  results: TMovie[];
};

class MovieList extends React.Component<TMovie, TMoviePage> {
  constructor(props) {
    super(props);
    this.state = {
      movies: null,
      needToLoadMovies: true,
      loading: false,
    };
    this.loadingRef = React.createRef(false);
  }

  componentDidMount() {
    this.loadMovies();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.needToLoadMovies !== this.state.needToLoadMovies) {
      this.loadMovies();
    }
  }

  async loadMovies() {
    const { needToLoadMovies } = this.state;
    if (needToLoadMovies && !this.loadingRef.current) {
      this.setState({ needToLoadMovies: false, loading: true });
      this.loadingRef.current = true;
      try {
        const movies = await getMovies('return');
        this.setState({ movies });
      } catch (ex) {
        console.error('error fetching movies', ex);
      } finally {
        this.setState({ loading: false });
        this.loadingRef.current = false;
      }
    }
  }

  render() {
    const { movies, loading } = this.state;
    return (
      <div className={css.page}>


        <div>movies list</div>
        <button type="button" onClick={() => this.setState({ needToLoadMovies: true })}>
          reload list
        </button>
        <div>loading: {`${loading}`}</div>
        <div className="cards">
          {movies?.results.map((movie) => {
            return (
              // <div key={movie.id}>{JSON.stringify(movie)}</div>
              <Card key={movie.id} hoverable style={cardStyle} styles={{ body: { padding: 0, overflow: 'hidden' } }}>
                <Flex justify="space-between">
                  <img
                    alt="avatar"
                    src={"https://image.tmdb.org/t/p/original" + (JSON.stringify(movie.poster_path)).replace(/^['"](.*)['"]$/, '$1')}
                    style={imgStyle}
                  />

                  <Flex vertical align="flex-end" justify="space-between" style={{ padding: 32 }}>
                    <Typography.Title level={3}>
                      {JSON.stringify(movie.title)}
                    </Typography.Title>

                    <Typography.Title level={4}>
                      {JSON.stringify(movie.overview)}
                    </Typography.Title>
                    <Button type="primary" href="https://ant.design" target="_blank">
                      Get Started
                    </Button>
                  </Flex>
                </Flex>
              </Card>
            )
          } )}
        </div>
      </div>
    );
  }
}

/*
function MovieList() {
  const [movies, setMovies] = useState(null as null | TMoviePage);
  const [needToLoadMovies, setNeedToLoadMovies] = useState(true);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);

  useEffect(() => {
    if (needToLoadMovies) {
      if (!loadingRef.current) {
        setNeedToLoadMovies(false);
        setLoading(true);
        loadingRef.current = true;

        (async () => {
          try {
            const movies = await getMovies('return');
            setMovies(movies);
          } catch (ex) {
            console.error('error fetching movies', ex);
          } finally {
            setLoading(false);
            loadingRef.current = false;
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
      <div>loading: {`${loading}`}</div>
      {movies?.results.map((movie) => <div key={movie.id}>{JSON.stringify(movie)}</div>)}
    </div>
  );
}*/
export default MovieList;
