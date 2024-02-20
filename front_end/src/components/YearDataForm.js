import React from 'react'
import VariableSelectForm from './VariableSelectForm.js'
import '../style.css'

class YearDataForm extends React.Component {
    constructor(){
        super()
        this.state = {
            year: '',
           // questionnaire: [],
            displayAlert: false,
            displayLoading: false,
            results: null,
            display:true
        }
        // binding functions associated with this component
        this.updateYear = this.updateYear.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.handleLoading = this.handleLoading.bind(this)
    }

    // this function is passed to variableSelectForm it turns off the display for the loading message and this form
    handleLoading(){
        this.setState({displayLoading: false, display:false})
        console.log(this.state.results)
    }

    // takes the year drop down value and stores it in state
    updateYear(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleClick(){
        if(this.state.year !== ''){
            this.setState({displayAlert: false})
            fetch(`YearComp/${this.state.year}/Demographics-Dietary-Examination-Laboratory-Questionnaire`)
            .then(response => response.json()).then(data => {this.setState({results:data})})
            this.setState({displayLoading:true})
            
        } else {
            this.setState({displayAlert: true})

        }
    }
    
    render() {
        // Constants for year dropdowns
        const years = [
            ['2011', '2011-2012'],
            ['2013', '2013-2014'],
            ['2015', '2015-2016'],
            ['2017', '2017-2018']
        ]
        // mapping each list into dropdown html
        const yearsOptions = years.map(ea => <option key={ea[0]} value={ea[0]}>{ea[1]}</option>)
        

        return (
            <div className='container-fluid text-center'>
                {this.state.display ? <div>
                    <div className='row '>
                        <div className='col-sm'>
                            {this.state.displayAlert ? <div className="alert alert-danger" role="alert">
                                                                You must select a year to start analysis!
                                                        </div> : null}
                            {this.state.displayLoading ? <div className="alert alert-success" role="alert">
                                                                Loading Data from API...If this takes longer than 10 seconds press the button again.
                                                        </div> : null}                        
                        </div>
                    </div>
                    <div className='row divRound'>
                        <div className='col-sm'>
                            <p>Select a year: </p>
                            <select name='year' onChange={this.updateYear}>
                            {(this.state.year === '') ? <option value=''> None Selected </option> : null}
                                {yearsOptions}
                            </select>
                        </div>
                    </div>
                    <br></br>
                    <br></br>
                    <div className='row'>
                        <div className='col-sm'>
                            <button className='btn btn-outline-primary btn-sm' onClick={this.handleClick}> Select Year and Start Analysis </button>
                        </div>
                    </div>
                    <hr></hr>
                </div>: null}
                
                <div className=''>
                    {/* if the results aren't empty, load in the next form */}
                    {/* passes the api call as results, the handleLoading function, and selected year to the next component */}
                    {(this.state.results !== null) ? <VariableSelectForm 
                                    results={this.state.results} 
                                    handleLoading={this.handleLoading}
                                    year={this.state.year}/> : null}
                </div>
            </div>
        )
    }
}

export default YearDataForm