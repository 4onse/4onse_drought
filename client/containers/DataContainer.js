import React, {Component} from 'react'
import MapComponent from '../components/MapComponent'
import ChartComponent from '../components/ChartComponent'
import ButtonGroup from '../components/ButtonGroup'
import LabelComponent from '../components/LabelComponent'
import Description from '../components/Description'
import getPieces from '../utils/utils'
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
  
  
  const overlayStyle = {
    float: 'left',
    margin: '0em 3em 1em 0em',
  }
  
  const fixedOverlayStyle = {
    ...overlayStyle,
    position: 'fixed',
    top: barStyle.height,
    zIndex: 500,
    margin: 5,
    backgroundColor: 'white',
    boxShadow: 'rgba(0, 0, 0, 0.2) 0px 3px 5px',
    borderRadius: '.28571429rem .28571429rem .28571429rem .28571429rem',
  }


const StationContext = React.createContext();


class DataContainer extends Component {
    state = {
        menuFixed: false,
        overlayFixed: false,
        selectedIndex: 0,
        indexes: ['Heat Index (HI)', 'SPI 30 days', 'SPI 60 days', 'Rain'],
        stationsList: [],
        stations: null
    }
    async getData(url, method, header) {
        // console.log('getData');
        
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
            console.log(e.message);
            var data = null
        } finally {
            return data
        }
    }
    onMrkrDblClick(station, evt) {
        let { stationsList } = this.state
        let check = stationsList.filter(
          (item) => item.name == station.name
        )
        if (check.length==0) {
          this.setState({
            stationsList: [
              ...stationsList,
              station
            ]
          })
        }
    }
    onLabelClick(i, evt) {    
        this.setState({
          stationsList: this.state.stationsList.filter(
            (item, index) => index != i
          )
        })
    }
    handleChange = (i, e) => this.setState(
        {
          selectedIndex: i,
          stationsList: []
        }    
    )
    componentDidMount() {
        var promises = this.props.geodata.map((item, index) => {
            var end = new Date(item.properties.samplingTime.endposition);
            var begin = new Date();
            
            if (item.properties.name.includes('SPI_')) {
                begin.setDate(end.getDate() - 365);
            } else if (item.properties.name.includes('HI_')) {
                begin.setDate(end.getDate() - 7);
            } else {
                let data = {'data': [item.data]}
                return data
            }
            var event_time = begin.toISOString() + '/' + end.toISOString()
            let url  = `/drought/api/wa/istsos/services/lkaqc/operations/getobservation/offerings/temporary/procedures/${item.properties.name}/observedproperties/:/eventtime/${event_time}`
            return this.getData(url, 'GET', item.headers)
        })
        Promise.all(promises).then((res)=>{
            this.setState({
                "stations": this.props.geodata.map((item, index) => {
                    try {
                        item.data = res[index].data[0]
                    }
                    catch(err) {
                        item.data = null
                    }
                    finally {
                        return item
                    }
                })
            })
        })
        
    }
    render () {
        let {
            barStyle, mapHeight,
            geodata, clientHeight,
            title, clientWidth, footer,
            chartHeight
        } = this.props
        let {
            indexes, selectedIndex,stations
        } = this.state

        if (stations!=null) {
            geodata = stations
        }
        var geodata_filtered;
        if (geodata != undefined) {
            if (this.state.selectedIndex == 0) {
                geodata_filtered =  geodata.filter(
                    item => item.properties.name.includes('HI_')
                )
            } else if (this.state.selectedIndex == 1 || this.state.selectedIndex == 2) {
                geodata_filtered = geodata.filter(
                    item => item.properties.name.includes('SPI_')
                )
            } else{
                geodata_filtered = geodata.filter(
                    item => !item.properties.name.includes('SPI_')
                ).filter(item2 => !item2.properties.name.includes('HI_'))
            }      
        }
        
        
        return(
            <div
                style={{paddingTop: barStyle.height}}
            >
                <StationContext.Provider
                  value={{
                    onMrkrDblClick: this.onMrkrDblClick,
                    indexes: this.state.indexes
                  }}
                >
                    <StationContext.Consumer>
                        {({onMrkrDblClick, indexes}) => (
                            <MapComponent
                                height={mapHeight}
                                data={geodata_filtered}
                                selectedIndex={selectedIndex}
                                indexes={indexes}
                                onMrkrDblClick={onMrkrDblClick.bind(this)}
                                plot={selectedIndex===3 ? 'bar' : 'line'}
                            />
                        )}
                    </StationContext.Consumer>
                    <ButtonGroup
                        handleChange={this.handleChange}
                        indexes={indexes}
                        selectedIndex={selectedIndex}
                        fixedOverlayStyle={fixedOverlayStyle}
                    />
                    <div
                        style={
                        {
                            maxHeight: chartHeight,
                            overflowY: 'auto',
                        }
                        }
                    >
                        <LabelComponent
                            stationsList={this.state.stationsList}
                            onLabelClick={this.onLabelClick.bind(this)}
                        />
                        {this.state.stationsList.length > 0 ?
                            <div>
                                <ChartComponent
                                    stations={this.state.stationsList}
                                    width={clientWidth}
                                    data={
                                    this.state.stationsList.map(
                                        (item) => (
                                        item.data.result.DataArray.values.map(
                                            item2 => {
                                            return [item2[0], parseFloat(item2[1]).toFixed(2)]
                                
                                            }
                                        )
                                        )
                                    )
                                    }
                                    plot={selectedIndex===3 ? 'bar' : 'line'}
                                    title={this.state.indexes[selectedIndex]}
                                    pieces={getPieces(selectedIndex)}
                                    id='chart-2'
                                />
                                <Description index={selectedIndex}/>
                            </div>  :
                            <div style={{height: chartHeight}}><Description index={selectedIndex}/></div>}
                    </div>
                </StationContext.Provider>              
            </div>
        )
    }
};

export default DataContainer;
