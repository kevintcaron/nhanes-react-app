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

    render() {
        return(<Plot
                    data={[
                        {
                            y: this.props.logX ? this.props.xData.map(ea => Math.log(ea)) : this.props.xData,
                            type: 'box',
                            name: `${this.props.sasLabel} (n=${this.props.xData.length})`
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