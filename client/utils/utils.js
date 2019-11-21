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
    } else if (i<=2) {
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
    } else {
        pieces = [{
            gte: 120,
            color: '#833494ff',
            label: "Very heavy event",
        }, {
            gte: 60,
            lt: 120,
            color: '#070a79ff',
            label: "Heavy rain event",
        }, {
            gte: 35,
            lt: 60,
            color: '#4d6bffff',
            label: "Rather heavy rain event",
        }, {
            gte: 10,
            lt: 35,
            color: '#8a9df9',
            label: "Moderate rain event",
        }, {
            gte: 1,
            lt: 10,
            color: '#cbfafbff',
            label: "Light rain event",
        }, {
            gte: 0,
            lt: 1,
            color: '#fff',
            label: "No rain",
        }]
    }
    return pieces
  }

  export default getPieces;