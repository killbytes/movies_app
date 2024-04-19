import { TGenre } from 'src/model/TGenre';

const apiBase = 'https://api.themoviedb.org/3/';

export async function getMovies(query: string, page: number) {
  const searchParams = new URLSearchParams({
    includeAdult: 'false',
    language: 'en-US',
    query,
    page: `${page}`,
  });
  const res = await fetch(`${apiBase}search/movie?${searchParams.toString()}`, {
    headers: {
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMWU1MWE2YjQ0Mzg4NmQ4Njk5ZTM3N2JhZTA1OGExNCIsInN1YiI6IjY1ZmZmYjA5MWIxZjNjMDE3YzlhMzk2ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.222dfYl3HBSBCiayswoRSSs118WqPZntjXLHyXgJ8M0',
    },
  });
  if (!res.ok) {
    throw new Error(`Could not fetch movies, received ${res.status}`);
  }
  return res.json();
}

export async function createGuestSession() {
  const res = await fetch(`${apiBase}authentication/guest_session/new`, {
    headers: {
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMWU1MWE2YjQ0Mzg4NmQ4Njk5ZTM3N2JhZTA1OGExNCIsInN1YiI6IjY1ZmZmYjA5MWIxZjNjMDE3YzlhMzk2ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.222dfYl3HBSBCiayswoRSSs118WqPZntjXLHyXgJ8M0',
    },
  });
  if (!res.ok) {
    throw new Error(`Could not fetch guest_session/new, received ${res.status}`);
  }
  return (await res.json()).guest_session_id as string;
}

export async function getGenres() {
  const res = await fetch(`${apiBase}genre/movie/list?language=en-US`, {
    headers: {
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMWU1MWE2YjQ0Mzg4NmQ4Njk5ZTM3N2JhZTA1OGExNCIsInN1YiI6IjY1ZmZmYjA5MWIxZjNjMDE3YzlhMzk2ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.222dfYl3HBSBCiayswoRSSs118WqPZntjXLHyXgJ8M0',
    },
  });
  if (!res.ok) {
    throw new Error(`Could not fetch genres, received ${res.status}`);
  }
  return (await res.json()).genres as TGenre[];
}

export async function addRating(movieId: number, guestSessionId: string, rating: number) {
  const res = await fetch(`${apiBase}movie/${movieId}/rating?guest_session_id=${guestSessionId}`, {
    cache: 'no-cache',
    method: 'POST',
    headers: {
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMWU1MWE2YjQ0Mzg4NmQ4Njk5ZTM3N2JhZTA1OGExNCIsInN1YiI6IjY1ZmZmYjA5MWIxZjNjMDE3YzlhMzk2ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.222dfYl3HBSBCiayswoRSSs118WqPZntjXLHyXgJ8M0',
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({ value: rating }),
  });
  if (!res.ok) {
    throw new Error(`Could not add rating, received ${res.status}`);
  }
  return undefined;
}

export async function deleteRating(movieId: number, guestSessionId: string) {
  const res = await fetch(`${apiBase}movie/${movieId}/rating?guest_session_id=${guestSessionId}`, {
    cache: 'no-cache',
    method: 'DELETE',
    headers: {
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMWU1MWE2YjQ0Mzg4NmQ4Njk5ZTM3N2JhZTA1OGExNCIsInN1YiI6IjY1ZmZmYjA5MWIxZjNjMDE3YzlhMzk2ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.222dfYl3HBSBCiayswoRSSs118WqPZntjXLHyXgJ8M0',
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=utf-8',
    },
  });
  if (!res.ok) {
    throw new Error(`Could not delete rating, received ${res.status}`);
  }
  return undefined;
}

export async function getRatedMovies(guestSessionId: string, page: number) {
  const searchParams = new URLSearchParams({
    page: `${page}`,
  });
  const res = await fetch(`${apiBase}guest_session/${guestSessionId}/rated/movies?${searchParams.toString()}`, {
    cache: 'no-cache',
    headers: {
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMWU1MWE2YjQ0Mzg4NmQ4Njk5ZTM3N2JhZTA1OGExNCIsInN1YiI6IjY1ZmZmYjA5MWIxZjNjMDE3YzlhMzk2ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.222dfYl3HBSBCiayswoRSSs118WqPZntjXLHyXgJ8M0',
    },
  });
  if (res.status === 404) {
    return {
      page: 1,
      results: [],
      total_results: 0,
    };
  }
  if (!res.ok) {
    throw new Error(`Could not fetch movies, received ${res.status}`);
  }
  return res.json();
}
