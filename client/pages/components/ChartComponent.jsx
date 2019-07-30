import React, { Component } from 'react'


class ChartComponent extends Component{
    getOption() {
        var {
            data, title,
            pieces, markLine,
            stations
        } = this.props
            
        let xLen = 0
        let indexLen = 0
        for (let index = 0; index < stations.length; index++) {
            const el = stations[index];
            if (data[index].length>xLen) {
                xLen = data[index].length
                indexLen = index
            }
        }
        
        var options = {
            title: {
                text: title
            },
            tooltip: {
                trigger: 'axis'
            },
            backgroundColor: '#F5F5F5',
            grid: { 
                bottom: '100'
            },
            xAxis: {
                data: data[indexLen].map(function (item2) {
                    return item2[0];
                })
            },
            yAxis: {
                splitLine: {
                    show: false
                }
            },
            toolbox: {
                left: 'center',
                showTitle: true,
                feature: {
                    restore: {
                        title: 'Reset'
                    },
                    saveAsImage: {
                        title: 'Save as image'
                    }
                }
            },
            dataZoom: [
                {
                    startValue: null
                }, {
                    type: 'inside'
                }
            ],
            visualMap: {
                top: 'bottom',
                padding: 50,
                orient: 'horizontal',
                pieces: pieces,
                outOfRange: {
                    color: '#999'
                }
            },
            series: stations.map(
                (item, index) =>(
                    {
                        name: item.name,
                        type: 'line',
                        data: data[index].map(function (item2) {
                            return item2[1];
                        }),
                        markLine: {
                            silent: true,
                            data: markLine
                        }
                    }
                )
            )
        }
        return options
    }
    componentDidUpdate() {
        let options = this.getOption()
        this.state.chart.setOption(options, true)
        this.state.chart.resize();
    }
    componentDidMount() {
        var myChart;
        myChart = echarts.init(document.getElementById(this.props.id));
        let options = this.getOption()
        myChart.setOption(options)
        this.setState({
            chart: myChart
        })
    }
    render () {
                
        return <div id={this.props.id} style={{height: 300, width: '100%', padding: 0}} />
    }
}

export default ChartComponent;