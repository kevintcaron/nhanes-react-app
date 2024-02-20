import React from 'react'
import '../style.css'
import VariableTable from '../components/VariableTable.js'
import Analysis from './Analysis.js'

class VariableSelectForm extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            display:true,

            continuousVars: [],
            categoricalVars: [],
            categoricalVarsLabels: [],
            
            variablesOfInterest: [],
            variablesDataFile: {},
            questionnaire: '',
            survey: '',
            surveyData: '',
            variable:'',

            dropdown1: {
                options: ''
            },
            dropdown2: {
                display:false,
                options: ''
            },
            dropdown3: {
                display:false,
                options: ''
            },

            variableDescription: {
                display:false,
                variableName:'',
                sasLabel:'',
                englishText:'',
                target:''
            },

            documentationLink: {
                displayLink: false,
                link: ''
            },

            variableTable: {
                display:false,
                data: null
            },

            buttonDisplay:false,
            displayWarning:false,
            displayVis:false
        }
        // binding functions
        this.handleDropdown1 = this.handleDropdown1.bind(this)
        this.handleDropdown2 = this.handleDropdown2.bind(this)
        this.handleDropdown3 = this.handleDropdown3.bind(this)
        this.addVariable = this.addVariable.bind(this)
        this.startVisualization = this.startVisualization.bind(this)
        this.dismount = this.dismount.bind(this)
        this.removeVariable = this.removeVariable.bind(this)
    }

    // built in componentDidMount function. It dismounts the previous form and laods the new one
    componentDidMount(){
        this.props.handleLoading()
        // taking the data that was passed from the last component and making the html options for the first dropdown and storing them in state.dropdown1
        const selectedQuestionnaires = Object.keys(this.props.results)
        const dropdownQuestionnaires = selectedQuestionnaires.map(ea => <option key={ea} value={ea}>{ea}</option>)
        this.setState({dropdown1:{
            options: dropdownQuestionnaires
        }})
    }

    // this function handles the user selecting a questionnaire from dropdown1. It stores the selected questionnaire in state
    //It also clears any display/values from dropdowns 2 & 3 to make the form reset as if it was freshly loaded
    handleDropdown1(event) {
        this.setState({
            [event.target.name]:event.target.value,
            variableDescription: {
                display:false
            },
            buttonDisplay:false,
            displayWarning:false,
            documentationLink: {
                displayLink:false
            },
            variableTable: {
                display:false
            },
            survey: ''
        })
        // making dropdown options for dropdown2 and storing them in state
        const surveys = Object.keys(this.props.results[event.target.value])
        const surveyOptions = surveys.map(ea => <option key={ea} value={ea}>{ea.substring(0,70)}</option>)
        this.setState({
            dropdown2: {
                options:surveyOptions,
                display:true},
            dropdown3: {
                display:false
            }
    })
    }

    // this function handles when dropdown2 is selected. It stores the selected survey in state.
    // it also clears display values from dropdown3
    handleDropdown2(event) {
        this.setState({
            [event.target.name]:event.target.value,
            buttonDisplay:false,
            displayWarning:false,
            documentationLink: {
                link: this.props.results[this.state.questionnaire][event.target.value]['Doc Url'],
                displayLink: true
            },
            variable: ''
        })
        // the api is called at the SurveyDoc route. This scrapes the survey documentation and grabs information about all variables from that survey
        // returned data is stored in state at surveyData
        fetch(`SurveyDoc/${this.props.year}/${this.props.results[this.state.questionnaire][event.target.value]['Doc File']}`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            const vars = Object.keys(data)
            const names = vars.map(ea => data[ea]['SAS Label'])
            const options = []
            for(let i = 0; i < vars.length; i++){
                options.push(<option key={vars[i]} value={vars[i]}>{vars[i]} - {names[i]}</option>)
            }

            this.setState({
                surveyData: data,
                dropdown3: {
                    options: options,
                    display:true
                },
                variableTable: {
                    display:false
                }
            })
        })
        this.setState({
            variableDescription: {
                display:false
            }
        })
    }
    
    // this function handles dropdown3. When it loads, the button to add a variable to your analysis appears. The current variable is stored in state. 
    // some basic information about the variable is displayed from the surveyData
    handleDropdown3(event){
        this.setState({
            [event.target.name]: event.target.value,
            variableDescription: {
                display:true,
                variableName: this.state.surveyData[event.target.value]['Variable Name'],
                sasLabel: this.state.surveyData[event.target.value]['SAS Label'],
                englishText: this.state.surveyData[event.target.value]['English Text'],
                target: this.state.surveyData[event.target.value]['Target']
            },
            buttonDisplay:true,
            displayWarning:false,
            variableTable: {
                display:true,
                data: this.state.surveyData[event.target.value]['DataFrame']
            }
        })
    }

    // this handles clicking on the add variable button. It appends the current variable to a list sotred in state.
    // if the current variable is already in that list, it displays a warning message saying this variable is already selected. 
    addVariable() {
        if(!this.state.variablesOfInterest.includes(this.state.variable)){
            this.setState(prevState => {
                return {
                    variablesOfInterest:prevState.variablesOfInterest.concat(this.state.variable),
                    displayWarning:false,
                    variablesDataFile: {
                        ...prevState.variablesDataFile,
                       [this.state.variable]: {
                           'xptPath':this.props.results[this.state.questionnaire][this.state.survey]['Doc File'].trim().split(' ')[0],
                           'sasLabel': this.state.surveyData[this.state.variable]['SAS Label']
                        }
                    }
                }
            })
            // trying to classify variable as continuous or categorical
            if( this.state.variableTable.data.data.length === 2 && 
                this.state.variableTable.data.data[0][1] === 'Range of Values' &&
                this.state.variableTable.data.data[1][1] === 'Missing'){
                this.setState(prevState => {
                    return {
                        continuousVars:prevState.continuousVars.concat(this.state.variable)
                    }
                })
            } else {
                this.setState(prevState => {
                    return {
                        categoricalVars:prevState.categoricalVars.concat(this.state.variable),
                        categoricalVarsLabels: prevState.categoricalVarsLabels.concat({
                            [this.state.variable]: this.state.variableTable.data.data}
                        )
                    }
                })
            }
        } else {
            this.setState({
                displayWarning:true,
            })
        }
    }

    removeVariable() {
        this.setState({
            variablesOfInterest: [],
            continuousVars: [],
            categoricalVars: [],
            variablesDataFile: {},
            categoricalVarsLabels: []
        })
    }

    // handles to start analysis button
    startVisualization() {
        this.setState({displayVis:true})
    }

    // passed to the PlotlyGraph component to dismount this component
    dismount() {
        this.setState({display:false})
    }


    
    render() {
        return(
            <div>
                {this.state.display ? <div className='container'>
                    <div className='row'>
                        {this.state.displayWarning ? <div className='container-fluid'>
                                                        <div className="alert alert-warning" role="alert">
                                                                This variable has already been selected, try another!
                                                        </div>
                                                    </div> : null}
                    </div>
                    <div className='row'>
                        <div className='col-sm'>
                            <p><b>Selected Year:</b> {this.props.year}-{parseInt(this.props.year) + 1}</p>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-sm'>
                            <p><b>Variables Selected for Analysis:</b> {this.state.variablesOfInterest.join('-')}</p>
                        </div>
                    </div>
                    <div className='row text-center'>
                        <div className='col-sm'>
                            {this.state.buttonDisplay ? <button className='btn btn-outline-primary' 
                                                                name='variablesOfInterest'
                                                                onClick={this.addVariable} 
                                                                >Click to add Variable to Analysis
                                                        </button>: null}
                        </div>
                            {(this.state.variablesOfInterest.length >= 1) ? <div className='col'> 
                                                                                <button className='btn btn-outline-primary'
                                                                                        onClick={this.removeVariable}
                                                                                        >Clear Selections                          
                                                                                </button>
                                                                        </div> : null}
                            {(this.state.variablesOfInterest.length >= 1) ? <div className='col'> 
                                                                                <button className='btn btn-outline-primary'
                                                                                        onClick={this.startVisualization}
                                                                                        >Start Analysis                          
                                                                                </button>
                                                                        </div> : null}
                        
                    </div>
                    <br></br>
                    <div className='row'>
                        <div className='col-lg'>
                            <div className='row '>
                                <pre>Select a Questionnaire: </pre>
                                <div>
                                    <select name='questionnaire' onChange={this.handleDropdown1}>
                                        {(this.state.questionnaire === '') ? <option value=''> None Selected </option> : null}
                                        {this.state.dropdown1.options}
                                    </select>
                                </div>
                            </div>
                            <br></br>
                            {this.state.dropdown2.display ?  <div className='row'>
                                                                <pre>Select a Survey:        </pre>
                                                                    <div>
                                                                        <select name='survey' onChange={this.handleDropdown2}>
                                                                        {(this.state.survey === '') ? <option value=''> None Selected </option> : null}
                                                                            {this.state.dropdown2.options}
                                                                        </select>
                                                                    </div>
                                                            </div>: null}
                                                            <br></br>
                            {this.state.dropdown3.display ?  <div className='row'>
                                                                <pre>Select a Variable:      </pre>
                                                                    <div>
                                                                        <select name='variable' onChange={this.handleDropdown3}>
                                                                        {(this.state.variable === '') ? <option value=''> None Selected </option> : null}
                                                                            {this.state.dropdown3.options}
                                                                        </select>
                                                                    </div>
                                                            </div>: null}
                                                            <br></br>
                            {this.state.documentationLink.displayLink ? <div className='row'>
                                                                <pre>NHANES documentation for this survey can be found <b><a 
                                                                    href={this.state.documentationLink.link} 
                                                                    target="_blank" 
                                                                    rel="noreferrer">here</a></b></pre>
                                                            </div> : null}  
                        </div>
                        {this.state.variableDescription.display ?   <div className='col-xl'>
                                                                        <div>
                                                                            <div className='row'><p>Variable Name:  {this.state.variableDescription.variableName} </p></div>
                                                                            <div className='row'><p>SAS Label:  {this.state.variableDescription.sasLabel} </p></div>
                                                                            <div className='row'><p>English Text:  {this.state.variableDescription.englishText} </p></div>
                                                                            <div className='row'><p>Target:  {this.state.variableDescription.target} </p></div>
                                                                        </div>
                                                                    </div>: null}
                    </div>
                    <div className='row text-center'>
                        <div className='col'></div>
                        <div className='col-7'>
                            {this.state.variableTable.display ? <VariableTable data={this.state.variableTable.data}/>: null}
                        </div>
                        <div className='col'></div>
                    </div>
                </div> : null}
            
            {/* conditonally rendered component */}
            {this.state.displayVis ? 
                    <div>
                        <Analysis    load={this.dismount}
                                     variablesOfInterest={this.state.variablesOfInterest}
                                     year={this.props.year}
                                     variablesDataFile={this.state.variablesDataFile}
                                     continuousVars={this.state.continuousVars}
                                     categoricalVars={this.state.categoricalVars}
                                     categoricalLabels={this.state.categoricalVarsLabels}
                        />
                    </div> : null}
            </div>
        )
    }
}

export default VariableSelectForm