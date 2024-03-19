import React from 'react';

export class GetData extends React.Component<any, any> {
  _apiBase = 'https://swapi.dev/api';

  constructor(props) {
    super(props);
  }

  async gerResource(url) => {
    const res = await fetch(`${this._apiBase}${url}`);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}` + `, received ${res.status}`);
    }

    return await res.json();
  }
  
  getAllPlanet() {
    return this.gerResource(`/planets/`);
  }

  getPlanet() {
    return this.gerResource(`/planets/${id}/`);
  }

  override render() {}
}

const Data = new GetData();
Data.getAllPlanet().then((body) => {
  console.log(body);
})

export default GetData;
