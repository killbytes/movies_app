import React from 'react';

export type RatedTabProps = object;
export type RatedTabState = object;

class RatedTab extends React.Component<RatedTabProps, RatedTabState> {
  override render() {
    return 'Rated Tab';
  }
}

export default RatedTab;
