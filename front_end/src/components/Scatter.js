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

    filterData() {
        var dataX = this.props.logX ? this.props.xData.map(ea => Math.log(ea)) : this.props.xData
        var dataY = this.props.logY ? this.props.yData.map(ea => Math.log(ea)) : this.props.yData
        var bool_arr_x = new Array(dataX.length).fill(true)
        var bool_arr_y = new Array(dataY.length).fill(true)

        // if no cut-offs, return original data
        if((this.props.xMax === null || this.props.xMax === '') && (this.props.xMin === null || this.props.xMin === '') && (this.props.yMax === null || this.props.yMax === '') && (this.props.yMin === null || this.props.yMin === '')){
            return [dataX, dataY]
        }

        // x has min, no max
        if((this.props.xMin !== null || this.props.xMin !== '') && (this.props.xMax === null || this.props.xMax === '')){
            for(let i = 0; i < dataX.length; i++){
                if(dataX[i] >= this.props.xMin){
                    bool_arr_x[i] = true
                } else{
                    bool_arr_x[i] = false
                }
            }
            // x has max, no min
        } else if((this.props.xMin === null || this.props.xMin === '') && (this.props.xMax !== null || this.props.xMax !== '')){
            for(let i = 0; i < dataX.length; i++){
                if(dataX[i] <= this.props.xMax){
                    bool_arr_x[i] = true
                } else{
                    bool_arr_x[i] = false
                }
            }
            // x has min and max
        } else if((this.props.xMin !== null || this.props.xMin !== '') && (this.props.xMax !== null || this.props.xMax !== '')){
            for(let i = 0; i < dataX.length; i++){
                if(dataX[i] <= this.props.xMax && dataX[i] >= this.props.xMin){
                    bool_arr_x[i] = true
                } else{
                    bool_arr_x[i] = false
                }
            }
        }

        // y has min, no max
        if((this.props.yMin !== null || this.props.yMin !== '') && (this.props.yMax === null || this.props.yMax === '')){
            for(let i = 0; i < dataY.length; i++){
                if(dataY[i] >= this.props.yMin){
                    bool_arr_y[i] = true
                } else{
                    bool_arr_y[i] = false
                }
            }
            // y has max, no min
        } else if((this.props.yMin === null || this.props.yMin === '') && (this.props.yMax !== null || this.props.yMax !== '')){
            for(let i = 0; i < dataY.length; i++){
                if(dataY[i] <= this.props.yMax){
                    bool_arr_y[i] = true
                } else{
                    bool_arr_y[i] = false
                }
            }
            // y has min and max
        } else if((this.props.yMin !== null || this.props.yMin !== '') && (this.props.yMax !== null || this.props.yMax !== '')){
            for(let i = 0; i < dataY.length; i++){
                if(dataY[i] <= this.props.yMax && dataY[i] >= this.props.yMin){
                    bool_arr_y[i] = true
                } else{
                    bool_arr_y[i] = false
                }
            }
        }

        var bool_xy = []

        for(let i =0; i < bool_arr_x.length; i++){
            if(bool_arr_x[i] === true && bool_arr_y[i] === true){
                bool_xy.push(true)
            } else {
                bool_xy.push(false)
            }
        }

        return [dataX.filter((r, i) => bool_xy[i]), dataY.filter((r, i) => bool_xy[i])]
    }

    render() {
        var datasets = this.filterData()
        return(
            <Plot style={{width: '100%'}}
                data={[
                        {
                            x: datasets[0],
                            y: datasets[1],
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
                    //width:1000
                   }}
            />
        )
    }
}

export default Scatter