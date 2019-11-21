import {Component} from 'react'
import {
    Container,
    Table,
    Divider
} from 'semantic-ui-react'


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
                    <Table.Row style={{backgroundColor: 'rgba(255, 0, 0, 0.6)'}}>
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
                    <Table.Row style={{backgroundColor: 'rgba(246,152,65,0.6)'}}>
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
                    <Table.Row style={{backgroundColor: 'rgba(237,228,57,0.6)'}}>
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
                    <Table.Row style={{backgroundColor: 'rgba(203,250,251,0.6)'}}>
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
                        <Table.HeaderCell>SPI Index</Table.HeaderCell>
                        <Table.HeaderCell>Dangers</Table.HeaderCell>
                    </Table.Row>
                    </Table.Header>
                    <Table.Body>
                    <Table.Row style={{backgroundColor: 'rgba(121,74,44,0.6)'}}>
                        <Table.Cell>
                        Extreme drought
                        </Table.Cell>
                        <Table.Cell>
                        Less than -2
                        </Table.Cell>
                        <Table.Cell>
                        Heat stroke highly likely
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row style={{backgroundColor: 'rgba(246,152,65,0.6)'}}>
                        <Table.Cell>
                        Severe drought
                        </Table.Cell>
                        <Table.Cell>
                        from -2 to -1.5
                        </Table.Cell>
                        <Table.Cell>
                        Heat cramps or heat exhaustion likely, and heat stroke possible with prolongued exposure and/or physical activity
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row style={{backgroundColor: 'rgba(237,228,57,0.6)'}}>
                        <Table.Cell>
                        Moderate drought
                        </Table.Cell>
                        <Table.Cell>
                        from -1.5 to -1
                        </Table.Cell>
                        <Table.Cell>
                        Heat stroke, heat cramps or heat exhaustion possible with prolonged exposure and/or physical activity
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row style={{backgroundColor: 'rgba(0,154,58,0.6)'}}>
                        <Table.Cell>
                        Normal
                        </Table.Cell>
                        <Table.Cell>
                        from -1 to 1
                        </Table.Cell>
                        <Table.Cell>
                        Fatique possible with prolongued exposure and/or physical activity
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row style={{backgroundColor: 'rgba(0,196,239,0.6)'}}>
                        <Table.Cell>
                        Moderate wet
                        </Table.Cell>
                        <Table.Cell>
                        from 1 to 1.5
                        </Table.Cell>
                        <Table.Cell>
                        Good conditions
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row style={{backgroundColor: 'rgba(0,63,242,0.6)'}}>
                        <Table.Cell>
                        Severe wet
                        </Table.Cell>
                        <Table.Cell>
                        from 1.5 to 2
                        </Table.Cell>
                        <Table.Cell>
                        Good conditions
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row style={{backgroundColor: 'rgba(112,42,169,0.6)'}}>
                        <Table.Cell>
                        Extreme wet
                        </Table.Cell>
                        <Table.Cell>
                        Greater than 2
                        </Table.Cell>
                        <Table.Cell>
                        Good conditions
                        </Table.Cell>
                    </Table.Row>
                    </Table.Body>
                </Table>
                Table 1. SPI index classification.
                </div>
            }
            />
            break;
        case 2:
            res = <ContentComponent
            title="Standard Precipitation Index (SPI 60)"
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
                        <Table.HeaderCell>SPI Index</Table.HeaderCell>
                        <Table.HeaderCell>Dangers</Table.HeaderCell>
                    </Table.Row>
                    </Table.Header>
                    <Table.Body>
                    <Table.Row style={{backgroundColor: 'rgb(121,74,44,0.6)'}}>
                        <Table.Cell>
                        Extreme drought
                        </Table.Cell>
                        <Table.Cell>
                        Less than -2
                        </Table.Cell>
                        <Table.Cell>
                        Heat stroke highly likely
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row style={{backgroundColor: 'rgba(246,152,65,0.6)'}}>
                        <Table.Cell>
                        Severe drought
                        </Table.Cell>
                        <Table.Cell>
                        from -2 to -1.5
                        </Table.Cell>
                        <Table.Cell>
                        Heat cramps or heat exhaustion likely, and heat stroke possible with prolongued exposure and/or physical activity
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row style={{backgroundColor: 'rgba(237,228,57,0.6)'}}>
                        <Table.Cell>
                        Moderate drought
                        </Table.Cell>
                        <Table.Cell>
                        from -1.5 to -1
                        </Table.Cell>
                        <Table.Cell>
                        Heat stroke, heat cramps or heat exhaustion possible with prolonged exposure and/or physical activity
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row style={{backgroundColor: 'rgba(0,154,58,0.6)'}}>
                        <Table.Cell>
                        Normal
                        </Table.Cell>
                        <Table.Cell>
                        from -1 to 1
                        </Table.Cell>
                        <Table.Cell>
                        Fatique possible with prolongued exposure and/or physical activity
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row style={{backgroundColor: 'rgba(0,196,239,0.6)'}}>
                        <Table.Cell>
                        Moderate wet
                        </Table.Cell>
                        <Table.Cell>
                        from 1 to 1.5
                        </Table.Cell>
                        <Table.Cell>
                        Good conditions
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row style={{backgroundColor: 'rgba(0,63,242,0.6)'}}>
                        <Table.Cell>
                        Severe wet
                        </Table.Cell>
                        <Table.Cell>
                        from 1.5 to 2
                        </Table.Cell>
                        <Table.Cell>
                        Good conditions
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row style={{backgroundColor: 'rgba(112,42,169,0.6)'}}>
                        <Table.Cell>
                        Extreme wet
                        </Table.Cell>
                        <Table.Cell>
                        Greater than 2
                        </Table.Cell>
                        <Table.Cell>
                        Good conditions
                        </Table.Cell>
                    </Table.Row>
                    </Table.Body>
                </Table>
                Table 1. SPI index classification.
                </div>
            }
            />
            break;
            case 3:
                res = <ContentComponent
                title="Rain daily data"
                content={
                    <div>
                    The daily sum of the {<strong>rain</strong>} amount daily rain data
                    , is a simple statistical anaylsis that is useful to highlight
                    particular heavy rain events. The map shows the rain data marked
                    in different colours based on the amount of the rain caollected by
                    the 4onse weather staitons. The last data collected is shown and
                    by clicking on the points the last seven days data are plotted.
                    In Table 1, the rainfall classification based on daily rainfall of a station
                    is proposed.
                    <Table celled>
                        <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Classification of rainfall event</Table.HeaderCell>
                            <Table.HeaderCell>Rainfall (R) in a day (mm)</Table.HeaderCell>
                        </Table.Row>
                        </Table.Header>
                        <Table.Body>
                        <Table.Row style={{backgroundColor: 'rgb(131,52,148,0.6)'}}>
                            <Table.Cell>
                            Very heavy rain event
                            </Table.Cell>
                            <Table.Cell>
                            {"R > 120.0"}
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row style={{backgroundColor: 'rgba(7,10,121,0.6)'}}>
                            <Table.Cell>
                            Heavy rain event
                            </Table.Cell>
                            <Table.Cell>
                            {"60.0 < R ≤ 120.0"}
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row style={{backgroundColor: 'rgba(77,107,255,0.6)'}}>
                            <Table.Cell>
                            Rather heavy rain event
                            </Table.Cell>
                            <Table.Cell>
                            {"35.0 < R ≤ 60.0"}
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row style={{backgroundColor: 'rgba(203,250,251,0.6)'}}>
                            <Table.Cell>
                            Moderate rain event
                            </Table.Cell>
                            <Table.Cell>
                            {"10.0 < R ≤ 35.0"}
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row style={{backgroundColor: 'rgba(138, 157, 249, 0.6)'}}>
                            <Table.Cell>
                            Light rain event
                            </Table.Cell>
                            <Table.Cell>
                            {"0.0 < R ≤ 15.0"}
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row style={{backgroundColor: 'rgb(255,255,255)'}}>
                            <Table.Cell>
                            No rain
                            </Table.Cell>
                            <Table.Cell>
                            R = 0
                            </Table.Cell>
                        </Table.Row>
                        </Table.Body>
                    </Table>
                    Table 1. Rainfall events classification.
                    </div>
                }
                />
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
};

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

export default Description;