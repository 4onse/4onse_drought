// import {L} from 'leaflet'
import React, { Component } from 'react'
import { Button, Header, Icon, Image, Modal, Table } from 'semantic-ui-react'
import ChartComponent from './ChartComponent'
import getPieces from '../utils/utils'


var mymap = null;

class MapComponent extends Component {
    state = {
      classes: ['hi', 'spi30', 'spi60', 'rain'],
      basemap: null,
      modalOpen: false,
      station: null
    }
    getColor(v) {
      let className = this.state.classes[this.props.selectedIndex]

      switch (className) {
        case 'hi':
          if (v <= 25) {
            return 'marker-white.png'
          } else if (v <= 32) {
            return 'marker-cyan.png'
          } else if (v <= 40) {
            return 'marker-yellow.png'
          } else if (v <= 53) {
            return 'marker-orange.png'
          } else {
            return 'marker-red.png'
          }
        case 'spi30':
            if (v <= -2) {
              return 'marker-brown.png'
            } else if (v <= -1.5) {
              return 'marker-orange.png'
            } else if (v <= -1) {
              return 'marker-yellow.png'
            } else if (v < 1) {
              return 'marker-green.png'
            } else if (v < 1.5) {
              return 'marker-cyan.png'
            } else if (v < 2) {
              return 'marker-blue.png'
            } else {
              return 'marker-purple.png'
            }
        case 'spi60':
            if (v <= -2) {
              return 'marker-brown.png'
            } else if (v <= -1.5) {
              return 'marker-orange.png'
            } else if (v <= -1) {
              return 'marker-yellow.png'
            } else if (v < 1) {
              return 'marker-green.png'
            } else if (v < 1.5) {
              return 'marker-cyan.png'
            } else if (v < 2) {
              return 'marker-blue.png'
            } else {
              return 'marker-purple.png'
            }
          case 'rain':
            if (v < 1) {
              return 'marker-blue4-r.png'
            } else if (v < 10) {
              return 'marker-blue3-r.png'
            } else if (v < 35) {
              return 'marker-blue2-r.png'
            } else if (v < 60) {
              return 'marker-blue-r.png'
            } else {
              return 'marker-purple.png'
            }
        default:
          break;
      }

    }

    onMarkerClick(item) {        
      this.setState({
        modalOpen: true,
        station: item
      })
    }

    handleClose = () => this.setState({modalOpen: false})

    getValue(dataArray) {
      let arr_len = dataArray.values.length
      
      let { selectedIndex } = this.props
      if (selectedIndex<=1 || selectedIndex==3) {
        // console.log(dataArray.values[arr_len-1]);
        
        return dataArray.values[arr_len-1][1]
      } else {
        return dataArray.values[arr_len-1][3]
      }
    }
    // componentDidUpdate(){
    //   this.createMarkers()
    // }
    createMarkers() {
      // let cols = ['hi', 'spi30', 'spi60']

      // let { selectedIndex } = this.props
      var { basemap } = this.state
      var timer = 0;
      var delay = 200;
      var prevent = false;

      if (basemap != null) {
        mymap.eachLayer(function(layer){
          if (layer._leaflet_id != basemap._leaflet_id) {
            mymap.removeLayer(layer);
          }
        }); 
      }

      let markers = this.props.data.map(
        (item) => {
          
          if (item.data != null) {

            if (item.data.result.DataArray.values.length > 0) {
              let v = this.getValue(item.data.result.DataArray)
              let iconFileName = this.getColor(v)
              let MarkerIcon = L.icon({
                iconUrl: '/static/leaflet/images/' + iconFileName,
                iconSize:     [15, 15], // size of the icon
                iconAnchor:   [-7.5, -7.5], // point of the icon which will correspond to marker's location
                popupAnchor:  [15, 15] // point from which the popup should open relative to the iconAnchor
              });
              return (
                L.marker([item.geometry.coordinates[1], item.geometry.coordinates[0]], {icon: MarkerIcon})
                  .on('click', (evt) => {
                    timer = setTimeout(() => {
                      if (!prevent) {
                        this.onMarkerClick(item);
                      }
                      prevent = false;
                    }, delay)}
                  )
                  .on('dblclick', (evt) => {
                    clearTimeout(timer);
                    prevent = true;
                    return this.props.onMrkrDblClick(item)
                  })
              )   
            } else {
              let MarkerIcon = L.icon({
                iconUrl: '/static/leaflet/images/marker-no-data.png',
                iconSize:     [15, 15], // size of the icon
                iconAnchor:   [-7.5, -7.5], // point of the icon which will correspond to marker's location
                popupAnchor:  [15, 15] // point from which the popup should open relative to the iconAnchor
              });
              
              return (
                L.marker([item.geometry.coordinates[1], item.geometry.coordinates[0]], {icon: MarkerIcon})
                  .bindPopup(`<p>${item.properties.name} No data</p>`)
              ) 
            }

            
            
          } else {
            let MarkerIcon = L.icon({
              iconUrl: '/static/leaflet/images/marker-no-data.png',
              iconSize:     [15, 15], // size of the icon
              iconAnchor:   [-7.5, -7.5], // point of the icon which will correspond to marker's location
              popupAnchor:  [15, 15] // point from which the popup should open relative to the iconAnchor
            });
            return (
              L.marker([item.geometry.coordinates[1], item.geometry.coordinates[0]], {icon: MarkerIcon})
                .bindPopup(`<p>${item.properties.name} No data</p>`)
            )
          }
            // .on('click', (evt) =>(this.props.onIconClick(item)))
        }
      )
  
      const markerLayer = L.featureGroup(markers)
      
      markerLayer.addTo(mymap)

    }
    componentDidUpdate() {
      this.createMarkers()
    }
    componentDidMount() {
      //   console.log(this.context);
      mymap = L.map(
        'mapid',
        {
          zoomControl: false,
          minZoom: 7
        }
      ).setView([8.8, 80.5], 7);
      // map.zoomControl.setPosition('topright');
      L.control.zoom({
        position: 'topright'
      }).addTo(mymap);
      const basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
          maxZoom: 18,
      })
      mymap.doubleClickZoom.disable(); 
      basemap.addTo(mymap)
      mymap.setMaxBounds(
        [
          [6.8,75],
          [10.8,85]
        ]
      );

      this.createMarkers()
      this.setState({
        basemap: basemap
      })
    }
    render () {
      const { height, indexes, selectedIndex, plot } = this.props
      const { station } = this.state
      var statValues;
      var stationData;
      if (station != null) {
        statValues = []
        
        stationData = station.data.result.DataArray.values.map(
          item => {
            if (selectedIndex<=1 || selectedIndex==3) {
              statValues.push(parseFloat(item[1]))
              return [item[0], parseFloat(item[1]).toFixed(2)] 
            } else {
              statValues.push(parseFloat(item[3]))
              return [item[0], parseFloat(item[3]).toFixed(2)] 
            }

          }
        )
      }
      
      return(
        <div>
          {
            station != null ? 
            <Modal
              open={this.state.modalOpen}
              onClose={this.handleClose}
            >
              <Modal.Header>{station.name}</Modal.Header>
              <Modal.Content image>
                <Modal.Description>
                  <Header>{station.properties.description}</Header>
                  <Table>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>Max</Table.HeaderCell>
                        <Table.HeaderCell>Min</Table.HeaderCell>
                        <Table.HeaderCell>Average</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell>{Math.max(...statValues).toFixed(2)}</Table.Cell>
                        <Table.Cell>{Math.min(...statValues).toFixed(2)}</Table.Cell>
                        <Table.Cell>
                          {(statValues.reduce(
                              (a,b) => a + b, 0
                            ) / statValues.length).toFixed(2)
                          }</Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                  <ChartComponent
                    stations={[station]}
                    data={[stationData]}
                    title={indexes[selectedIndex]}
                    pieces={getPieces(selectedIndex)}
                    id='chart-1'
                    plot={plot}
                  />
                </Modal.Description>
              </Modal.Content>
            </Modal> : null
          }
          <div
            id="mapid"
            style={
              {
                border: "1px solid black",
                borderRadius: '5px',
                height: height,
                width: '100%',
                padding: 0
              }
            }
          />
        </div>
      )
    }
  }

  

  export default MapComponent;