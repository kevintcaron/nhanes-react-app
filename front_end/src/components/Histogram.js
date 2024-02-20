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

    render() {
        return(
            <Plot
                data={[
                    {
                        x: this.props.logX ? this.props.xData.map(ea => Math.log(ea)) : this.props.xData,
                        type: 'histogram',
                        name: this.props.sasLabel
                    }
                ]}
                layout={{
                    title: this.props.title,
                    xaxis: {title: this.props.x_title}, 
                    yaxis: {title: "Count"},
                    height:700,
                    width:1000}}
            />
            )}
}

export default Histogram