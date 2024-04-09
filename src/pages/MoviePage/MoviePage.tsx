import React from 'react';
import { Alert, Spin, Tabs } from 'antd';

import { createGuestSession } from 'src/api/GetData';
import MovieTab from 'src/components/MovieTab/MovieTab';
import RatedTab from 'src/components/RatedTab/RatedTab';
import css from './MoviePage.module.scss';

export type MoviePageProps = object;
export type MoviePageState = {
  isLoading: boolean;
  isError: boolean;
  error: any;
  isInited: boolean;
};

// search: string | null | Array<number|string>

class MoviePage extends React.Component<MoviePageProps, MoviePageState> {
  isloading = false;

  constructor(props: never) {
    super(props);
    this.state = {
      isLoading: false,
      isError: false,
      error: null,
      isInited: false,
    };
  }

  override componentDidMount() {
    this.createSession();
  }

  createSession = () => {
    if (!this.isloading) {
      this.setState({
        isLoading: true,
        isError: false,
        error: null,
      });
      this.isloading = true;

      (async () => {
        try {
          await createGuestSession();
          this.setState({
            isInited: true,
          });
        } catch (ex) {
          console.error('error fetching movies', ex);
          this.setState({
            isError: true,
            error: ex,
          });
        } finally {
          this.setState((prevState) => ({ ...prevState, isLoading: false }));
          this.isloading = false;
        }
      })();
    }
  };

  override render() {
    const { isLoading, isError, error, isInited } = this.state;

    return (
      <>
        {isLoading && <Spin className={css.spinLoading}/>}
        {isError &&
          (function () {
            if (['Failed to fetch', 'Network error'].includes(error.message))
              return <Alert type="error" message="Ошибка соединения с сервером, возможно проблема с интернетом" />;
            return <Alert type="error" message={`Неизвестная ошибка: ${error.message}`} />;
          })()}
        {isInited && (
          <Tabs
            defaultActiveKey="1"
            centered
            items={[
              {
                key: 'Search',
                label: `Search`,
                children: <MovieTab />,
              },
              {
                key: 'Rated',
                label: `Rated`,
                children: <RatedTab />,
              },
            ]}
          />
        )}
      </>
    );
  }
}

export default MoviePage;
