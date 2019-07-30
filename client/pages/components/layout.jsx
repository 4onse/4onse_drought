import _ from 'lodash'
import React, { Component } from 'react'
import Head from 'next/head'
import {
  Container,
  Image,
  List,
  Menu,
  Icon,
  Segment,
  Dimmer,
  Loader,
  Label,
  Button
} from 'semantic-ui-react'
import GridFooter from './GridFooter'
import MapComponent from './MapComponent'
import getPieces from '../utils/utils'
import ChartComponent from './ChartComponent'
import {
  BrowserView,
  MobileView,
  isMobile
} from "react-device-detect";


const StationContext = React.createContext();

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



class StickyLayout extends Component {
  state = {
    menuFixed: false,
    overlayFixed: false,
    selectedIndex: 0,
    indexes: ['Heat Index (HI)', 'SPI 30 days', 'SPI 60 days'],
    stationsList: []
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

  render() {
    let { geodata, clientHeight, title, clientWidth, footer } = this.props
    let {indexes, selectedIndex, overlayRect} = this.state
    let contentHeight;
    if (clientHeight!=null) {
      contentHeight = clientHeight - barStyle.height- footerStyle.height - 8
    } else {
      contentHeight = 400
    }
    let mapHeight = contentHeight*3/7
    let chartHeight = contentHeight-mapHeight

    var geodata_filtered;
    if (geodata != undefined) {
      if (this.state.selectedIndex == 0) {
        geodata_filtered =  geodata.filter(
          item => item.properties.name.includes('HI_')
        )
      } else {
        geodata_filtered = geodata.filter(
          item => item.properties.name.includes('SPI_')
        )
      }      
    }    
    
    return (
      <div>
        <Head>
            <title>{title}</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" key="viewport" />
            <link rel="stylesheet" href="/static/semantic/semantic.min.css" />
            <link rel="stylesheet" href="/static/leaflet/leaflet.css" />
            <script src="/static/leaflet/leaflet.js"></script>
            <script src="/static/echarts/echarts.min.js"></script>
            {/* <script src="/static/lib/echarts/echarts.js"></script>} */}
        </Head>
        <BrowserView>
          <div>
            <Menu
              borderless
              fixed={'top'}
              style={barStyle}
            >
              <Container text>
                <Menu.Item>
                  <Image size='mini' src='/logo.png' />
                </Menu.Item>
                <Menu.Item header>4onse - Drought monitoring system</Menu.Item>
              </Container>
            </Menu>
          </div>
          <Container
            style={
              {
                boxShadow: '0 0 6em 0 rgba(0,0,0,0.6)',
                backgroundColor:'white',
                width: isMobile ? '100%' : null
              }
            }
          >
          {
            this.props.loader ?
              <Container style={{
                paddingTop: barStyle.height,
                width: clientWidth,
                height: mapHeight,
              }}>
                <div style={{height: mapHeight-28}}>
                  <Dimmer active>
                    <Loader />
                  </Dimmer>
                </div>
              </Container> :
              <div
                style={
                  {
                    paddingTop: barStyle.height,
                  }
                }
              >
                <StationContext.Provider 
                  value={{
                    onMrkrDblClick: this.onMrkrDblClick,
                    indexes: this.state.indexes
                  }}
                >
                  <StationContext.Consumer>
                    {
                      ({onMrkrDblClick, indexes}) => (
                        <MapComponent
                          height={mapHeight}
                          data={geodata_filtered}
                          selectedIndex={selectedIndex}
                          indexes={indexes}
                          onMrkrDblClick={onMrkrDblClick.bind(this)}
                        />
                      )
                    }
                  </StationContext.Consumer>
                  <div style={fixedOverlayStyle}>
                    <Button.Group>
                      <Button
                        positive={selectedIndex == 0 ? true : false}
                        onClick={this.handleChange.bind(this, 0)}
                      >
                        {indexes[0]}
                      </Button>
                      <Button.Or />
                      <Button
                        positive={selectedIndex == 1 ? true : false}
                        onClick={this.handleChange.bind(this, 1)}
                      >
                        {indexes[1]}
                      </Button>
                      <Button.Or />
                      <Button
                        positive={selectedIndex == 2 ? true : false}
                        onClick={this.handleChange.bind(this, 2)}
                      >
                        {indexes[2]}
                      </Button>
                    </Button.Group>
                  </div>
                  <div
                    style={
                      {
                        maxHeight: chartHeight,
                        overflowY: 'auto',
                      }
                    }
                  >
                    <div>
                      {this.state.stationsList.map(
                        (item, index) => <Label onClick={this.onLabelClick.bind(this, index)} key={`lb-stat-key-${index}`} as='a'>
                          {item.name}
                          <Icon name='delete' />
                        </Label>
                      )}
                    </div>
                    {this.state.stationsList.length > 0 ? <ChartComponent
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
                      title={this.state.indexes[selectedIndex]}
                      pieces={getPieces(selectedIndex)}
                      id='chart-2'
                    /> : <div style={{height: chartHeight}}>Drought index description</div>}
                  </div>
                </StationContext.Provider>
              </div>
          }
          </Container>
          <div>
            <Segment inverted vertical style={{padding: 3}}>
              <Container textAlign='center' style={footerStyle}>
                {footer !=null ? <GridFooter data={footer}/> : null}
                <List horizontal inverted divided link >
                  <List.Item as='a' href='#'>
                    Site Map
                  </List.Item>
                  <List.Item as='a' href='#'>
                    Contact Us
                  </List.Item>
                  <List.Item as='a' href='#'>
                    Terms and Conditions
                  </List.Item>
                  <List.Item as='a' href='#'>
                    Privacy Policy
                  </List.Item>
                </List>
              </Container>
            </Segment>
          </div>
        </BrowserView>
        <MobileView>
          sono un mobile
        </MobileView>
      </div>
      
    )
  }
}

export default StickyLayout;