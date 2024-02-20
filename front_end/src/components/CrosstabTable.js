import React from 'react'

class CrosstabTable extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            labels: null
        }
    }

    componentDidMount() {
        this.props.handleLoading()
        console.log(this.props.labels)
        console.log(Object.values(this.props.labels[0]))
    }
    
    render(){

        let rowMapped = {}
        for(let i = 0; i < this.props.labels.length; i++) {
            if(this.props.xVar === Object.keys(this.props.labels[i])[0]){
                let rowLabels = this.props.labels[i]
                for(let j = 0; j < rowLabels[this.props.xVar].length; j++){
                    rowMapped[rowLabels[this.props.xVar][j][0]] = rowLabels[this.props.xVar][j][1]
                }
            }
        }
        let colMapped = {}
        for(let i = 0; i < this.props.labels.length; i++) {
            if(this.props.yVar === Object.keys(this.props.labels[i])[0]){
                let colLabels = this.props.labels[i]
                for(let j = 0; j < colLabels[this.props.yVar].length; j++){
                    colMapped[colLabels[this.props.yVar][j][0]] = colLabels[this.props.yVar][j][1]
                }
            }
        }
        console.log(rowMapped)
        console.log(colMapped)

        const headers = [<th key={' '}>{'  '}</th>]
        for(let i = 0; i < this.props.data['Columns'].length; i++) {
            headers.push(<th key={this.props.data['Columns'][i]}><b>{(colMapped[this.props.data['Columns'][i]]) ? colMapped[this.props.data['Columns'][i]] : 'Total'}</b></th>)
        }

        let rows = new Array(this.props.data['Rows'].map(row => 
            <tr key={row}>
                <td bgcolor='E9ECEF' id={'boldTD'} key={Math.random()}> {(rowMapped[row[0]]) ? rowMapped[row[0]] : 'Total'} </td>
                {row.slice(1).map(entry => <td key={Math.random()}> {entry}</td>)}   
            </tr>))

        return(
            <div>
                <p className='text-center'> {`Rows - ${this.props.xLabel} (${this.props.xVar})`} </p>
                <p className='text-center'> {`Columns - ${this.props.yLabel} (${this.props.yVar})`} </p>
                <table className='table table-bordered'>
                    <thead className='thead-light'>
                        <tr>
                            {headers}
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default CrosstabTable