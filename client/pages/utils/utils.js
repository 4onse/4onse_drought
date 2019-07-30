function getPieces(i) {
    let pieces;
    if (i==0) {
      pieces = [{
          lte: 25,
          color: ' #000',
          label: "Normal",
      }, {
          gt: 25,
          lte: 32,
          color: '#00C4EF',
          label: "Caution",
      }, {
          gt: 32,
          lte: 40,
          color: '#EDE439',
          label: "Extreme caution",
      }, {
          gt: 40,
          lte: 53,
          color: '#F69841',
          label: "Danger",
      }, {
          gt: 53,
          color: '#D50000',
          label: "Extreme danger",
      }]
    } else {
      pieces = [{
          lte: -2,
          color: '#794a2c',
          label: "Extreme drought",
      }, {
          gt: -2,
          lte: -1.5,
          color: '#F69841',
          label: "Severe drought",
      }, {
          gt: -1.5,
          lte: -1,
          color: '#EDE439',
          label: "Moderate drought",
      }, {
          gt: -1,
          lt: 1,
          color: '#009a3a',
          label: "Normal",
      }, {
          gte: 1,
          lte: 1.5,
          color: '#00C4EF',
          label: "Moderate wet",
      }, {
          gt: 1.5,
          lte: 2,
          color: '#003ff2',
          label: "Severe wet",
      }, {
        gt: 2,
        color: '#702aa9',
        label: "Extreme wet",
      }]
    }
    return pieces
  }

  export default getPieces;