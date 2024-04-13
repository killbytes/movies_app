import React from 'react';

class VoteAverage extends React.PureComponent<{ value: number }, object> {
  override render() {
    const { value } = this.props;
    return (
      <div
        style={{
          width: 40,
          height: 40,
          minWidth: 40,
          minHeight: 40,
          display: 'grid',
          placeItems: 'center',
          borderWidth: 2,
          borderStyle: 'solid',
          borderRadius: 999999,
          borderColor: (function () {
            if (value < 3) return '#E90000';
            if (value < 5) return '#E97E00';
            if (value < 7) return '#E9D100';
            return '#66E900';
          })(),
        }}
      >
        {value.toFixed(1)}
      </div>
    );
  }
}
export default VoteAverage;
