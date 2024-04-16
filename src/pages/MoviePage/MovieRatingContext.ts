import { createContext } from 'react';

export const MovieRatingContext = createContext<{ rating: Map<number, number>, setRating: (setRating: (ratingMap: Map<number, number>) => void) => void }>({
  rating: new Map<number, number>(),
  setRating: () => {},
});
