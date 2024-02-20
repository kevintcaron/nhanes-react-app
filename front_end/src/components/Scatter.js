import React from 'react'
import Plot from 'react-plotly.js';

class Scatter extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            
        }
    }

    componentDidMount(){
        this.props.handleLoading()
    }

    render() {
        return(
            <Plot
                data={[
                        {
                            x: (this.props.logX ? this.props.xData.map(ea => Math.log(ea)) : this.props.xData),
                            y: (this.props.logY ? this.props.yData.map(ea => Math.log(ea)) : this.props.yData),
                            type: 'scatter',
                            mode:'markers',
                            name: 'Test Scatter',
                            marker: {
                                opacity: 0.3
                            }
                        }
                    ]}
                layout={{
                    title: this.props.title,
                    xaxis: {title: this.props.xLabel}, 
                    yaxis: {title: this.props.yLabel},
                    height:700,
                    width:1000
                   }}
            />
        )
    }
}

export default Scatter