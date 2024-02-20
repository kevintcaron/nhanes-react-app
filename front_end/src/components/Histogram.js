import React from 'react'
import Plot from 'react-plotly.js';

class Histogram extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            
        }
    }

    componentDidMount(){
        this.props.handleLoading()
    }

    filterData() {

        var data = this.props.logX ? this.props.xData.map(ea => Math.log(ea)) : this.props.xData
        if(this.props.xMin !== null && this.props.xMin !== ''){
            data = data.filter(v => v >= this.props.xMin)
        }
        if(this.props.xMax !== null && this.props.xMax !== ''){
            data = data.filter(v => v <= this.props.xMax)
        }
    
        return data
    }

    render() {
        return(
            <Plot style={{width: '100%'}}
                data={[
                    {
                        x: this.filterData(),
                        type: 'histogram',
                        name: this.props.sasLabel,
                        autobinx: false,
                        xbins: {
                            start: this.props.xMin ? this.props.xMin : Math.min(...this.filterData()),
                            end: this.props.xMax ? this.props.xMax : Math.max(...this.filterData())
                        }
                    }
                ]}
                layout={{
                    title: this.props.title,
                    xaxis: {title: this.props.x_title}, 
                    yaxis: {title: "Count"},
                    autosize: true,
                    height:700,
                    //width:1000
                }}
            />
            )}
}

export default Histogram