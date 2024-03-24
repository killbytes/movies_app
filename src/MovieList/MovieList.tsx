import { useEffect, useRef, useState } from 'react';

import { getMovies } from 'src/GetData';

import css from './MoviesList.module.scss';

export type TMovie = {
  id: number;
};
export type TMoviePage = {
  page: number;
  results: TMovie[];
};

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
}
export default MovieList;
