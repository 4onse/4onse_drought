// pages/index.js
import MainContent from '../components/MainContent.js';
import Layout from '../components/MyLayout.js';
import fetch from 'isomorphic-unfetch'


const barStyle = {
  backgroundColor: '#fff',
  border: '1px solid #ddd',
  boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
  height: 50,
  zIndex: 10000,
}

const footerStyle = {
  height: 23
}

// const indexPageContent = <MainContent barStyle={barStyle} footerStyle={footerStyle} />;

function Index(props) {
  return <Layout title='4onse - Drought monitoring system' content={<MainContent barStyle={barStyle} footerStyle={footerStyle} stations={props.stations}/>} barStyle={barStyle} footerStyle={footerStyle} />;
}

async function getData(url, method, header) {
  
  try {
      let response = await fetch(
          url,
          {
              method: method,
              headers: header
          }
      )
      
      var data = await response.json()
  } catch (e) {
    var data = null
  } finally {
    return data
  }
}

Index.getInitialProps = async ({ req }) => {
  var d = new Date();
  var n = d.getMilliseconds();
  const res = await fetch(
    'http://192.168.0.138/istsos/wa/istsos/services/lkaqc/procedures/operations/geojson?epsg=4326',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic c3JpOnNyaQ=='
      }
    }
  )
  if (res.status == 200) {
    const json_data = await res.json()
    const data_filt = json_data.features
    // map through the repo list
    const promises = data_filt.map(async (item, index) => {
      var event_time = item.properties.samplingTime.endposition
      var end = new Date(item.properties.samplingTime.endposition);
      var begin_time = new Date();
      begin_time.setDate(end.getDate() - 1);
      let url;
      if (item.properties.name.includes('SPI_') || item.properties.name.includes('HI_')) {

        url  = `http://192.168.0.138/istsos/lkaqc?service=SOS&version=1.0.0&request=GetObservation&offering=temporary&procedure=${item.properties.name}&eventTime=${begin_time.toISOString()}/${event_time}&observedProperty=:&responseFormat=application/json&qualityIndex=true`
        
      } else {
        begin_time.setDate(end.getDate() - 6);
        url  = `http://192.168.0.138/istsos/api/lkaqc?service=SOS&version=1.0.0&request=GetObservation&offering=temporary&procedure=${item.properties.name}&eventTime=${begin_time.toISOString()}/${event_time}&observedProperty=rain&aggregateInterval=PT24H&aggregateFunction=SUM&responseFormat=application/json&qualityIndex=true`
      }
      return getData(url, 'GET', {
        'Content-Type': 'application/json',
        'Authorization': 'Basic c3JpOnNyaQ=='
      })
    })

    // wait until all promises resolve
    const results = await Promise.all(promises).then((res)=>{
      return data_filt.map((item, index)=>{
        try {
          // console.log(res[index]);
          
          var station_data_json = res[index]
          var station_data = station_data_json['ObservationCollection']['member'][0]
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
            data: station_data,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Basic c3JpOnNyaQ=='
            }
          }
        }
      })
    })
    // const results = await Promise.all(promises)
    // console.log(results);
    var d2 = new Date();
    var n2 = d2.getMilliseconds();
    console.log((n2-n)/1000);
    
    
    return { stations: results }
  } else {
    return { stations: null }
  }
};

export default Index;

