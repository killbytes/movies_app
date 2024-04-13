export class GetData {
  private apiBase = 'https://swapi.dev/api';

  async getResource(url: string) {
    const res = await fetch(`${this.apiBase}${url}`);
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`);
    }
    return res.json();
  }

  async getAllPlanet() {
    return this.getResource(`/planets`);
  }

  async getPlanets(id: number | string) {
    return this.getResource(`/planets/${id}`);
  }
}

/* const Data = new GetData();
Data.getAllPlanet().then((body) => {
  console.log(body);
}); */

const apiBase = 'https://api.themoviedb.org/3/';
async function getResource(url: string) {
  const res = await fetch(`${apiBase}search/${url}`, {
    headers: {
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMWU1MWE2YjQ0Mzg4NmQ4Njk5ZTM3N2JhZTA1OGExNCIsInN1YiI6IjY1ZmZmYjA5MWIxZjNjMDE3YzlhMzk2ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.222dfYl3HBSBCiayswoRSSs118WqPZntjXLHyXgJ8M0',
    },
  });
  if (!res.ok) {
    throw new Error(`Could not fetch ${url}, received ${res.status}`);
  }
  return res.json();
}

export async function getMovies(query: string, page: number) {
  const searchParams = new URLSearchParams({
    includeAdult: 'false',
    language: 'en-US',
    query,
    page: `${page}`,
  });
  return getResource(`movie?${searchParams.toString()}`);
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
  return undefined;
}
