import { createContext } from 'react';

import { TGenre } from 'src/model/TGenre';

export const GenresContext = createContext<TGenre[]>([]);
