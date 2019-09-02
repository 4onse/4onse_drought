import fetch from 'isomorphic-unfetch'
import Head from 'next/head'
import React, { Component } from 'react'
import StickyLayout from './components/layout'


const title = '4onse - Drought monitoring system'


const HeadTag = () => (
  <Head>
      <title>{title}</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" key="viewport" />
      <link rel="stylesheet" href="/static/leaflet/leaflet.css" />
      <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" />
      <script src="/static/leaflet/leaflet.js"></script>
      <script src="/static/lib/echarts/echarts.js"></script>
  </Head>
)


class Home extends Component {
  state = {
    innerHeight: null,
    innerWidth: null
  }
  componentDidMount() {
    
    this.setState({
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight
    })
    window.addEventListener('resize', this.reportWindowSize.bind());
  }
  reportWindowSize = () => {
    this.setState({
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight
    })
  }
	render () {
    let { stations } = this.props
    
    if (stations!=null && this.state.innerHeight!=null) {
      // let stationsList = stations.map(
      //   (item, index) => <p key={`key-station-${index}`}>{item.properties.name}</p>
      // )
      return <StickyLayout 
        clientWidth={this.state.innerWidth}
        clientHeight={this.state.innerHeight}
        title={title}
        geodata={stations}
        footer={null}
        loader={false}
      />
    } else {
      return (
        <StickyLayout
          clientWidth={this.state.innerWidth}
          clientHeight={this.state.innerHeight}
          title={title}
          loader={true}
          footer={null}
        />
      )
    }
		
	}
}
  
Home.getInitialProps = async ({ req }) => {
  if (req) {
    const res = await fetch(
      'http://geoservice.ist.supsi.ch/4onse/wa/istsos/services/lkaqc/procedures/operations/geojson?epsg=4326',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': '***'
        }
      }
    )
    if (res.status == 200) {
      const json_data = await res.json()
      const data_filt = json_data.features.filter(
        item => item.properties.name.includes('SPI_') || item.properties.name.includes('HI_')
      )
  
      var end = new Date();
      var begin = new Date();
      begin.setDate(end.getDate() - 7);
      var begin_spi = new Date();
      begin_spi.setDate(end.getDate() - 365);
  
      var event_time = begin.toISOString() + '/' + end.toISOString()
      var event_time_spi = begin_spi.toISOString() + '/' + end.toISOString()
  
      // return { stations: data_filt }
  
      // map through the repo list
      const promises = data_filt.map(async (item, index) => {
        let url;
        if (item.properties.name.includes('SPI_')) {
          url  = `http://geoservice.ist.supsi.ch/4onse/wa/istsos/services/lkaqc/operations/getobservation/offerings/temporary/procedures/${item.properties.name}/observedproperties/:/eventtime/${event_time_spi}`
        } else {
          url  = `http://geoservice.ist.supsi.ch/4onse/wa/istsos/services/lkaqc/operations/getobservation/offerings/temporary/procedures/${item.properties.name}/observedproperties/:/eventtime/${event_time}`
        }
        const response = await fetch(
          url,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': '***'
            }
          }
        )

        try {
          var station_data_json = await response.json()
          var station_data = station_data_json['data'][0]
        }
        catch(err) {
          var station_data = null
        }
        finally {
          return {
            name: item.properties.name,
            properties: item.properties,
            geometry: item.geometry,
            index: index,
            data: station_data
          }
        }
      })
  
      // wait until all promises resolve
      const results = await Promise.all(promises)
      return { stations: results }
    } else {
      return { stations: null }
    }
  } else {    
    return { stations: null }
  }
};

export default Home;
  
