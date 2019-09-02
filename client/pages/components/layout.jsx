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
  Button,
  Divider,
  Table
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
                  <Image size='mini' src='/static/logo.svg' />
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
                    /> : <div style={{height: chartHeight}}><Description index={selectedIndex}/></div>}
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

class ContentComponent extends Component{
  render () {
    return(
      <Container textAlign='justified' style={{padding: 25}}>
        <b>{this.props.title}</b>
        <Divider />
        {this.props.content}
      </Container>
    )
  }
}

class Description extends Component{
  render () {
    let { index } = this.props
    let res;
    
    switch (index) {
      case 0:
        res = <ContentComponent
          title="Heat Index (HI)"
          content={
          <div>
            The Heat Index ({<strong>HI</strong>}), or Apparent Temperature 
            ({<strong>AT</strong>}), is an index derived from the combination
            between temperature and relative humidity in Fahrenheit degrees (F°). 
            It gives information about the physiological disconfort due to high
            temperatures and high humidity rates. In table 1, the heat index 
            classification is described:
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Intensity level</Table.HeaderCell>
                  <Table.HeaderCell>Heat Index</Table.HeaderCell>
                  <Table.HeaderCell>Dangers</Table.HeaderCell>
                  <Table.HeaderCell>Category</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row style={{backgroundColor: 'red'}}>
                  <Table.Cell>
                    Very high
                  </Table.Cell>
                  <Table.Cell>
                    Higher than 53°C
                  </Table.Cell>
                  <Table.Cell>
                    Heat stroke highly likely
                  </Table.Cell>
                  <Table.Cell>
                    Extreme danger
                  </Table.Cell>
                </Table.Row>
                <Table.Row style={{backgroundColor: 'orange'}}>
                  <Table.Cell>
                    High
                  </Table.Cell>
                  <Table.Cell>
                    40-53°C
                  </Table.Cell>
                  <Table.Cell>
                    Heat cramps or heat exhaustion likely, and heat stroke possible with prolongued exposure and/or physical activity
                  </Table.Cell>
                  <Table.Cell>
                    Danger
                  </Table.Cell>
                </Table.Row>
                <Table.Row style={{backgroundColor: 'yellow'}}>
                  <Table.Cell>
                    Medium
                  </Table.Cell>
                  <Table.Cell>
                    32-40°C
                  </Table.Cell>
                  <Table.Cell>
                    Heat stroke, heat cramps or heat exhaustion possible with prolonged exposure and/or physical activity
                  </Table.Cell>
                  <Table.Cell>
                    Extreme caution
                  </Table.Cell>
                </Table.Row>
                <Table.Row style={{backgroundColor: 'cyan'}}>
                  <Table.Cell>
                    Low
                  </Table.Cell>
                  <Table.Cell>
                    25-32°C
                  </Table.Cell>
                  <Table.Cell>
                    Fatique possible with prolongued exposure and/or physical activity
                  </Table.Cell>
                  <Table.Cell>
                    Caution
                  </Table.Cell>
                </Table.Row>
                <Table.Row style={{backgroundColor: 'white'}}>
                  <Table.Cell>
                    Very low
                  </Table.Cell>
                  <Table.Cell>
                    Lower than 25°C
                  </Table.Cell>
                  <Table.Cell>
                    Good conditions
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
            Table 1. Heat index classification.
          </div>
          }
          />
        break;
      case 1:
        res = <ContentComponent
          title="Standard Precipitation Index (SPI 30)"
          content={
            <div>
              The Standard Precipitation Index ({<strong>SPI</strong>}) 
              (McKee at al., 1993), is a statistical index that uses 
              historical time series of almost 30 years to represent 
              and detect abnormal wet or dry periods. The SPI is 
              recommended by the World Meteorological Office (WMO) 
              as a principal indicator. Hereinafter the classification 
              of the index is represented.
              <Table celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Intensity level</Table.HeaderCell>
                    <Table.HeaderCell>Heat Index</Table.HeaderCell>
                    <Table.HeaderCell>Dangers</Table.HeaderCell>
                    <Table.HeaderCell>Category</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <Table.Row style={{backgroundColor: 'red'}}>
                    <Table.Cell>
                      Very high
                    </Table.Cell>
                    <Table.Cell>
                      Higher than 53°C
                    </Table.Cell>
                    <Table.Cell>
                      Heat stroke highly likely
                    </Table.Cell>
                    <Table.Cell>
                      Extreme danger
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row style={{backgroundColor: 'orange'}}>
                    <Table.Cell>
                      High
                    </Table.Cell>
                    <Table.Cell>
                      40-53°C
                    </Table.Cell>
                    <Table.Cell>
                      Heat cramps or heat exhaustion likely, and heat stroke possible with prolongued exposure and/or physical activity
                    </Table.Cell>
                    <Table.Cell>
                      Danger
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row style={{backgroundColor: 'yellow'}}>
                    <Table.Cell>
                      Medium
                    </Table.Cell>
                    <Table.Cell>
                      32-40°C
                    </Table.Cell>
                    <Table.Cell>
                      Heat stroke, heat cramps or heat exhaustion possible with prolonged exposure and/or physical activity
                    </Table.Cell>
                    <Table.Cell>
                      Extreme caution
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row style={{backgroundColor: 'cyan'}}>
                    <Table.Cell>
                      Low
                    </Table.Cell>
                    <Table.Cell>
                      25-32°C
                    </Table.Cell>
                    <Table.Cell>
                      Fatique possible with prolongued exposure and/or physical activity
                    </Table.Cell>
                    <Table.Cell>
                      Caution
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row style={{backgroundColor: 'white'}}>
                    <Table.Cell>
                      Very low
                    </Table.Cell>
                    <Table.Cell>
                      Lower than 25°C
                    </Table.Cell>
                    <Table.Cell>
                      Good conditions
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </div>
          }
        />
        break;
      case 2:
        res = <ContentComponent title="Standard Precipitation Index (SPI 60)" content="Test"/>
        break;
      default:
        res = <div>Error index not found!</div>
        break;
    }
    return(
      <div>
        {res}
      </div>
    )
  }
}

export default StickyLayout;