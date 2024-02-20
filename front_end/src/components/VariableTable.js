import React from 'react'

function VariableTable(props) {
    // checks if the variable has a table to display
    if(props.data === 0){
        return <p> This variable has no assoicated codebook table. </p>
    } else {
        // creating table html
        console.log(props.data)
        console.log(props.check)
        

        let headers = (props.check === 1) ? 
            new Array(props.data.columns.slice(0,-1).map(ea => <th key={ea}>{ea}</th>)) :
            new Array(props.data.columns.map(ea => <th key={ea}>{ea}</th>))

        let rows = (props.check === 1) ? new Array(props.data.data.map(row => 
                                            <tr key={row}>
                                                {row.slice(0,-1).map(entry => <td key={Math.random()}> {entry }</td>)}   
                                            </tr>)) :
                                        new Array(props.data.data.map(row => 
                                            <tr key={row}>
                                                {row.map(entry => <td key={Math.random()}> {entry }</td>)}   
                                            </tr>))

        
        // structuring the information into a html table
        return <table className='table table-bordered'>
                    <thead className='thead-light'>
                        <tr>
                            {headers}
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
               </table>
    }
}

export default VariableTable