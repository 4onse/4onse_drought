import {
    Container,
    Dimmer,
    Loader
} from 'semantic-ui-react'
import { Component } from 'react'
import { isMobile } from 'react-device-detect'
import DataContainer from "../containers/DataContainer"


class MainContent extends Component{
    state = {
        innerHeight: null,
        innerWidth: null
    }
    componentDidMount() {
        window.addEventListener('resize', this.reportWindowSize.bind());

        this.setState({
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight
        })
    }
    reportWindowSize = () => {
        this.setState({
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight
        })
    }
    render () {
        let {innerWidth, innerHeight} = this.state
        let {stations, barStyle, footerStyle} = this.props
        let contentHeight;
        if (innerHeight!=null) {
            contentHeight = innerHeight - footerStyle.height - 6 - barStyle.height
        } else {
            contentHeight = 400
        }
        let mapHeight = contentHeight*3/7
        let chartHeight = contentHeight-mapHeight
        
        
        return(
            <Container
                style={
                    {
                    boxShadow: '0 0 6em 0 rgba(0,0,0,0.6)',
                    backgroundColor:'white',
                    width: isMobile ? '100%' : null
                    }
                }
            >
                <Container>
                    {stations==null ?
                        <Dimmer active><Loader /></Dimmer> :
                        <DataContainer
                            barStyle={barStyle}
                            mapHeight={mapHeight}
                            geodata={stations}
                            chartHeight={chartHeight}
                        />
                    }
                </Container>
            </Container>
        )
    }
};

export default MainContent;