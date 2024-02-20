import React from 'react'
import Plot from 'react-plotly.js';

class Boxplot extends React.Component{
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
        return(<Plot
                    data={[
                        {
                            y: this.filterData(),
                            type: 'box',
                            name: `${this.props.sasLabel} (n=${this.filterData().length})`
                        }
                    ]}
                    layout={{
                        title: this.props.title,
                        //xaxis: {title: "Value"}, 
                        yaxis: {title: this.props.y_title},
                        height:700,
                        width:1000}}
                />)
            }
}

export default Boxplot