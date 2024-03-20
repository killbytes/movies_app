export class GetData {
  private apiBase = 'https://swapi.dev/api';

  gerResource = async (url: string) => {
    const res = await fetch(`${this.apiBase}${url}`);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`);
    }

    return res.json();
  };

  getAllPlanet() {
    return this.gerResource(`/planets/`);
  }

  getPlanet(id: number | string) {
    return this.gerResource(`/planets/${id}/`);
  }
}

const Data = new GetData();
Data.getAllPlanet().then((body) => {
  console.log(body);
});

export default GetData;
