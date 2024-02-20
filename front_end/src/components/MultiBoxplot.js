import React from 'react'
import Plot from 'react-plotly.js';

class MultiBoxplot extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            
        }
    }

    componentDidMount(){
        this.props.handleLoading()
    }

    render() {
        let labels = null
        for(let i = 0; i < this.props.catLabels.length; i++) {
            if(this.props.xLabel === Object.keys(this.props.catLabels[i])[0]){
                labels = this.props.catLabels[i]
            }
        }

        let label_values = {}
        for(let i = 0; i < Object.keys(labels[this.props.xLabel]).length; i++){
            label_values[labels[this.props.xLabel][i][0]] = labels[this.props.xLabel][i][1]
        }

        function testKey(val){
            try {
                let key_ftm = parseInt(val)
                return key_ftm
            } catch(err) {
                return val
            }
        }

        let dataList = []
        for (const [key, value] of Object.entries(this.props.data)) {
            dataList.push({
                y: this.props.logY ? value.map(ea => Math.log(ea)) : value,
                type: 'box',
                name: `${label_values[testKey(key)]} (n=${value.length})`
              
                
            })
        }

        return(
            <Plot
                    data={dataList}
                    layout={{
                        title: this.props.title,
                        xaxis: {title: this.props.xAxis}, 
                        yaxis: {title: this.props.yAxis},
                        height:700,
                        width:1100
                        }}
    
                />
        )
    }
}

export default MultiBoxplot