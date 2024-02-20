import React from 'react'
import CsvDownloader from 'react-csv-downloader'

import Boxplot from '../components/Boxplot.js'
import Histogram from '../components/Histogram.js'
import Scatter from '../components/Scatter.js'
import MultiBoxplot from '../components/MultiBoxplot.js'
import CrosstabTable from './CrosstabTable.js'
import VariableTable from './VariableTable.js'

class Analysis extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            continuousOptions:null,
            categoricalOptions:null,
            
            type: null,

            graphTypeDropdowns: null,
            displayGraphSelect: false,
            graphType: null,

            displayXVarSelect: false,
            displayXYVarSelect: false,
            xVarName: null,
            xData: null,
            yVarName: null,
            yData: null,
            multiBoxData: null,
            crosstabData: null,

            displayLogButton: false,
            displayMulitBoxLog:false,
            logDataX:false,
            logDataY: false,

            displayBox: false,
            displayLoading: false,

            downloadSingleDatas: null,
            downloadSingleColumns: null,
            downloadMultipleDatas: null,
            downloadMultipleColumns: null,

            xVarMin: null,
            xVarMax: null,
            yVarMin: null,
            yVarMax: null,

        }
        this.handleClick = this.handleClick.bind(this)
        this.selectType = this.selectType.bind(this)
        this.selectGraphType = this.selectGraphType.bind(this)
        this.selectXVar = this.selectXVar.bind(this)
        this.selectYVar = this.selectYVar.bind(this)
        this.logTransformX = this.logTransformX.bind(this)
        this.logTransformY = this.logTransformY.bind(this)
        this.handleLoading = this.handleLoading.bind(this)
        this.inputCutoffs = this.inputCutoffs.bind(this)
        this.customAlert = this.customAlert.bind(this)
    }

    // function defined in VariableSelectForm, dismounts the previous form when loaded
    componentDidMount() {
        this.props.load()
        console.log(this.props.variablesDataFile)
        console.log(this.props.categoricalLabels)
        console.log(this.props.freqTableData)

        const contOptions = this.props.continuousVars.map(ea => <option key={ea} value={ea}>{ea} {`(${this.props.variablesDataFile[ea]['sasLabel']})`} </option>)
        const catOptions = this.props.categoricalVars.map(ea => <option key={ea} value={ea}>{ea} {`(${this.props.variablesDataFile[ea]['sasLabel']})`}</option>)

        this.setState({
            continuousOptions: contOptions,
            categoricalOptions: catOptions
        })

    }
    // turn off loading notification
    handleLoading(){
        this.setState({displayLoading: false})
    }

    // allows user to select single or multi analysis
    selectType(event) {
        const multiGraphs = ['Scatter Plot', 'Box Plot', 'Frequency Table']
        const singleGraphs = ['Histogram', 'Box Plot', 'Frequency Table']
        const multiGraphsOptions = multiGraphs.map(ea => <option key={ea} value={ea}>{ea}</option>)
        const singleGraphsOptions = singleGraphs.map(ea => <option key={ea} value={ea}>{ea}</option>)

        this.setState({
            type: event.target.value,
            displayGraphSelect: true,
            displayXVarSelect: false,
            displayXYVarSelect: false,
            xVarName: null,
            yVarName: null,
            displayBox: false,
            displayLogButton: false,
            displayMulitBoxLog: false,
            displayloading: false,
            xVarMax: null,
            xVarMin: null,
            yVarMax: null,
            yVarMin: null
        })

        if(event.target.value === 'single'){
            this.setState({
                graphTypeDropdowns: singleGraphsOptions,
                graphType: null,
            })
        } else {
            this.setState({
                graphTypeDropdowns: multiGraphsOptions,
                graphType: null,
            })
        }
    }

    // function to select graph type
    selectGraphType(event) {
        this.setState({
            graphType: event.target.value,
            xVarName: null,
            yVarName: null,
            displayBox: false,
            displayLogButton: false,
            logDataX: false,
            logDataY: false,
            displayMulitBoxLog: false,
            displayLoading: false,
            xVarMax: null,
            xVarMin: null,
            yVarMax: null,
            yVarMin: null
        })
        if(this.state.type === 'single'){
            this.setState({
                displayXVarSelect: true
            })
        } else {
            this.setState({
                displayXYVarSelect: true
            })
        }
    }

    selectXVar(event) {
        this.setState({
            xVarName: event.target.value,
            displayBox: false,
            displayLogButton: false,
            logDataX: false,
            logDataY: false,
            displayMulitBoxLog: false,
            xVarMax: null,
            xVarMin: null,
            yVarMax: null,
            yVarMin: null
        })
    }

    selectYVar(event) {
        this.setState({
            yVarName: event.target.value,
            logDataX: false,
            logDataY: false,
            displayBox: false,
            displayLogButton: false,
            displayMulitBoxLog: false,
            xVarMax: null,
            xVarMin: null,
            yVarMax: null,
            yVarMin: null
        })
    }

    logTransformX() {
        if(this.state.type === 'single' && this.state.logDataX === false) {
            this.setState({
                logDataX: true
            })
        } else if(this.state.type === 'single' && this.state.logDataX === true) {
            this.setState({
                logDataX: false
            })
        } else if(this.state.type === 'multi' && this.state.graphType === 'Scatter Plot' && this.state.logDataX === false) {
            this.setState({
                logDataX: true
            })
        } else if(this.state.type === 'multi' && this.state.graphType === 'Scatter Plot' && this.state.logDataX === true) {
            this.setState({
                logDataX: false
            })
        }
    }

    logTransformY() {
        if(this.state.type === 'multi' && this.state.logDataY === false) {
            this.setState({
                logDataY: true
            })
        } else if(this.state.type === 'multi' && this.state.logDataY === true) {
            this.setState({
                logDataY: false
            })
        }
    }

    handleClick() {
        // getting data for a single variable analysis, plots and prepares data for download
        if(this.state.xVarName !== null && this.state.type === 'single' && this.state.graphType !== 'Frequency Table') {
            this.setState({displayLoading: true})
            fetch(`getData/${this.props.year}/${this.props.variablesDataFile[this.state.xVarName]["xptPath"]}/${[this.state.xVarName]}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                const dataForDownload = []
                for(let i = 0; i < Object.values(data[this.state.xVarName]).length; i++) {
                    dataForDownload.push({first: Object.values(data['SEQN'])[i], second: Object.values(data[this.state.xVarName])[i]})
                }
                this.setState({
                    xData: Object.values(data[this.state.xVarName]),
                    displayBox: true,
                    displayLogButton: true,
                    downloadSingleDatas: dataForDownload,
                    downloadSingleColumns: [{
                        id: 'first',
                        displayName: 'SEQN'
                      }, {
                        id: 'second',
                        displayName: `${this.state.xVarName}`
                      }]
                })
            })
        // single Categorical Variable frequency Table 
        } else if(this.state.xVarName !== null && this.state.type === 'single' && this.state.graphType === 'Frequency Table') {
            fetch(`getData/${this.props.year}/${this.props.variablesDataFile[this.state.xVarName]["xptPath"]}/${[this.state.xVarName]}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                const dataForDownload = []
                for(let i = 0; i < Object.values(data[this.state.xVarName]).length; i++) {
                    dataForDownload.push({first: Object.values(data['SEQN'])[i], second: Object.values(data[this.state.xVarName])[i]})
                }
                this.setState({
                    xData: this.props.freqTableData[this.state.xVarName],
                    displayBox: true,
                    downloadSingleDatas: dataForDownload,
                    downloadSingleColumns: [{
                        id: 'first',
                        displayName: 'SEQN'
                      }, {
                        id: 'second',
                        displayName: `${this.state.xVarName}`
                      }]
                })
            })
        // getting data for a multiple variable analysis, plots and prepares data for download
        } else if(this.state.type === 'multi' && this.state.xVarName !== null && this.state.yVarName !== null && this.state.graphType === 'Scatter Plot') {
            if(this.state.xVarName !== this.state.yVarName) {
            this.setState({displayLoading: true})
            fetch(`getDataXY/${this.props.year}/${this.props.variablesDataFile[this.state.xVarName]["xptPath"]}-${this.props.variablesDataFile[this.state.yVarName]["xptPath"]}/${this.state.xVarName}-${this.state.yVarName}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                const dataForDownload = []
                for(let i = 0; i < Object.values(data[this.state.xVarName]).length; i++) {
                    dataForDownload.push({first: Object.values(data['SEQN'])[i], 
                    second: Object.values(data[this.state.xVarName])[i],
                    third: Object.values(data[this.state.yVarName])[i]})
                }
                this.setState({
                    xData: Object.values(data[this.state.xVarName]),
                    yData: Object.values(data[this.state.yVarName]),
                    displayBox: true,
                    displayLogButton: true,
                    displayLoading: true,
                    downloadMultipleDatas: dataForDownload,
                    downloadMultipleColumns: [{
                        id: 'first',
                        displayName: 'SEQN'
                      }, {
                        id: 'second',
                        displayName: `${this.state.xVarName}`}, {
                        id: 'third',
                        displayName: `${this.state.yVarName}`
                    }]
                })
            // Added to handle the trival case of a scatter plot with the same variable
            // getting data for a multiple variable analysis, plots and prepares data for download
            })} else if(this.state.xVarName === this.state.yVarName) {
                this.setState({displayLoading: true})
                fetch(`getData/${this.props.year}/${this.props.variablesDataFile[this.state.xVarName]["xptPath"]}/${[this.state.xVarName]}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    const dataForDownload = []
                    for(let i = 0; i < Object.values(data[this.state.xVarName]).length; i++) {
                        dataForDownload.push({first: Object.values(data['SEQN'])[i], 
                        second: Object.values(data[this.state.xVarName])[i],
                        third: Object.values(data[this.state.yVarName])[i]})
                    }
                    this.setState({
                        xData: Object.values(data[this.state.xVarName]),
                        yData: Object.values(data[this.state.xVarName]),
                        displayBox: true,
                        displayLogButton: true,
                        displayLoading: true,
                        downloadMultipleDatas: dataForDownload,
                        downloadMultipleColumns: [{
                            id: 'first',
                            displayName: 'SEQN'
                          }, {
                            id: 'second',
                            displayName: `${this.state.xVarName}`}, {
                            id: 'third',
                            displayName: `${this.state.yVarName}`
                        }]
                    })
                })
            }
        // getting data for a multiple variable analysis, two fetches are used, one for plotting and one for csv download
        } else if(this.state.type === 'multi' && this.state.xVarName !== null && this.state.yVarName !== null && this.state.graphType === 'Box Plot') {
            this.setState({displayLoading: true})
            // first fecthes data in a form to build the plot
            fetch(`getDataXYBoxPlot/${this.props.year}/${this.props.variablesDataFile[this.state.xVarName]["xptPath"]}-${this.props.variablesDataFile[this.state.yVarName]["xptPath"]}/${this.state.xVarName}-${this.state.yVarName}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.setState({
                    displayBox: true,
                    multiBoxData: data,
                    displayMulitBoxLog: true,
                    displayLoading: true
                })
            })
            // then re-fetch data in a form that allows easy conversion to csv
            fetch(`getDataXY/${this.props.year}/${this.props.variablesDataFile[this.state.xVarName]["xptPath"]}-${this.props.variablesDataFile[this.state.yVarName]["xptPath"]}/${this.state.xVarName}-${this.state.yVarName}`)
            .then(response => response.json())
            .then(data => {
                const dataForDownload = []
                for(let i = 0; i < Object.values(data[this.state.xVarName]).length; i++) {
                    dataForDownload.push({first: Object.values(data['SEQN'])[i], 
                    second: Object.values(data[this.state.xVarName])[i],
                    third: Object.values(data[this.state.yVarName])[i]})
                }
                this.setState({
                    downloadMultipleDatas: dataForDownload,
                    downloadMultipleColumns: [{
                        id: 'first',
                        displayName: 'SEQN'
                      }, {
                        id: 'second',
                        displayName: `${this.state.xVarName}`}, {
                        id: 'third',
                        displayName: `${this.state.yVarName}`
                    }]
                })
            })
        // fetch data for categorical frequency table    
        } else if (this.state.type === 'multi' && this.state.xVarName !== null && this.state.yVarName !== null && this.state.graphType === 'Frequency Table'){
            this.setState({displayLoading: true})
            fetch(`getCrosstabXY/${this.props.year}/${this.props.variablesDataFile[this.state.xVarName]["xptPath"]}-${this.props.variablesDataFile[this.state.yVarName]["xptPath"]}/${this.state.xVarName}-${this.state.yVarName}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.setState({
                    displayBox: true,
                    displayLoading: true,
                    crosstabData: data
                })
            })
            // then re-fetch data in a form that allows easy conversion to csv
            fetch(`getDataXY/${this.props.year}/${this.props.variablesDataFile[this.state.xVarName]["xptPath"]}-${this.props.variablesDataFile[this.state.yVarName]["xptPath"]}/${this.state.xVarName}-${this.state.yVarName}`)
            .then(response => response.json())
            .then(data => {
                const dataForDownload = []
                for(let i = 0; i < Object.values(data[this.state.xVarName]).length; i++) {
                    dataForDownload.push({first: Object.values(data['SEQN'])[i], 
                    second: Object.values(data[this.state.xVarName])[i],
                    third: Object.values(data[this.state.yVarName])[i]})
                }
                this.setState({
                    downloadMultipleDatas: dataForDownload,
                    downloadMultipleColumns: [{
                        id: 'first',
                        displayName: 'SEQN'
                      }, {
                        id: 'second',
                        displayName: `${this.state.xVarName}`}, {
                        id: 'third',
                        displayName: `${this.state.yVarName}`
                    }]
                })
            })
        }
    }

    inputCutoffs(event) {
        this.setState({
            [event.target.name]: event.target.value,
        })
    }

    customAlert(){
        if(this.props.year !== 'SpecialCase'){
            if(this.state.type === 'single'){
                alert(`Downloading the raw non-null data from the NHANES website to your downloads folder. Any filters and or log transformations you've applied will not be reflected in this data:
                        Year: ${this.props.year}
                        Variable: ${this.props.variablesDataFile[this.state.xVarName]["sasLabel"]}
                        Filename: ${this.props.year}-${parseInt(this.props.year) + 1}_${this.state.xVarName}.csv
                    `)
            } else if(this.state.type === 'multi'){
                alert(`Downloading the raw non-null data from the NHANES website. Any filters and or log transformations you've applied will not be reflected in this data:
                        Year: ${this.props.year}
                        X-Variable: ${this.props.variablesDataFile[this.state.xVarName]["sasLabel"]}
                        Y-Variable: ${this.props.variablesDataFile[this.state.yVarName]["sasLabel"]}
                        Filename: ${this.props.year}-${parseInt(this.props.year) + 1}_${this.state.xVarName}_${this.state.yVarName}.csv
                    `)
            }
        } else {
            if(this.state.type === 'single'){
                alert(`Downloading the raw non-null data from the NHANES website. Any filters and or log transformations you've applied will not be reflected in this data:
                        Year: 2017 - March 2020 Pre-Covid
                        Variable: ${this.props.variablesDataFile[this.state.xVarName]["sasLabel"]}
                        Filename: 2017 - March 2020 Pre-Covid_${this.state.xVarName}.csv
                    `)
            } else if(this.state.type === 'multi'){
                alert(`Downloading the raw non-null data from the NHANES website. Any filters and or log transformations you've applied will not be reflected in this data:
                        Year: 2017 - March 2020 Pre-Covid
                        X-Variable: ${this.props.variablesDataFile[this.state.xVarName]["sasLabel"]}
                        Y-Variable: ${this.props.variablesDataFile[this.state.yVarName]["sasLabel"]}
                        Filename: 2017 - March 2020 Pre-Covid_${this.state.xVarName}_${this.state.yVarName}.csv
                    `)
            }
        }
    }

    render() {
        return (
            <div>
                <div>
                    {/* displays the selected NHANES variable codes selected previous form */}
                    {(this.props.year !== 'SpecialCase') ?
                        <p><b>Selected Year:</b> {this.props.year}-{parseInt(this.props.year) + 1}</p> : 
                        <p><b>Selected Year:</b> 2017 - March 2020 Pre-Covid </p>
                    }
                    <p> <b>Variables Available for Analysis:</b> {Object.keys(this.props.variablesDataFile).map(ea => `${ea} (${this.props.variablesDataFile[ea]['sasLabel']})`).join(' --- ')} </p>
                </div>
                <hr></hr>

                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="single" onChange={this.selectType}></input>
                    <label className="form-check-label" htmlFor="inlineRadio1">Single Variable Analysis</label>
                </div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="multi" onChange={this.selectType}></input>
                    <label className="form-check-label" htmlFor="inlineRadio2">Multiple Variable Analysis</label>
                </div>
                
                <div className='row'>
                        {this.state.displayGraphSelect ? <div className='col-sm'>
                                                            <br></br>
                                                            <p>Select Graph Type: </p>
                                                            <select name='graphType' onChange={this.selectGraphType} defaultValue={''}>
                                                                <option value=''> None Selected </option>
                                                                {this.state.graphTypeDropdowns}
                                                            </select>
                                                        </div>: null}
                        {this.state.displayXVarSelect  ? <div className='col-sm'>
                                                            <br></br>
                                                            <p>Select X Variable: </p>
                                                            <select name='graphType' onChange={this.selectXVar} defaultValue={''}>
                                                                <option value=''> None Selected </option>
                                                                {(this.state.graphType === 'Box Plot' || 
                                                                  this.state.graphType === 'Histogram') ? this.state.continuousOptions : this.state.categoricalOptions}
                                                            </select>
                                                        </div>: null}
                        {this.state.displayXYVarSelect  ? <div className='col-sm'>
                                                            <div>
                                                            <br></br>
                                                            <p>Select X Variable: </p>
                                                            <select name='graphType' onChange={this.selectXVar} defaultValue={''}>
                                                                <option value=''> None Selected </option>
                                                                {(this.state.graphType === 'Scatter Plot') ? this.state.continuousOptions : this.state.categoricalOptions}
                                                            </select>
                                                            </div>
                                                            <br></br>
                                                            <div>
                                                            <p>Select Y Variable: </p>
                                                            <select name='graphType' onChange={this.selectYVar} defaultValue={''}>
                                                                <option value=''> None Selected </option>
                                                                {(this.state.graphType === 'Scatter Plot' || 
                                                                    this.state.graphType === 'Box Plot') ? this.state.continuousOptions : this.state.categoricalOptions}
                                                            </select>
                                                            </div>
                                                        </div>: null}
                </div>

                <br></br>
                <div className='row'>
                        <div className='col-sm'>
                        <br></br>
                        {this.state.displayLoading ? <div className="alert alert-success" role="alert">
                                                                Loading Data from API and Building Graph...
                                                        </div> : null}
                        <br></br>
                        </div>
                </div>
                <div className='container'>
                    <div className='row d-flex justify-content-center'>
                        {this.state.displayLogButton ? 
                            <div>
                                <div className='col-sm'>
                                    <button className="btn btn-outline-dark" onClick={this.logTransformX}>Log Transform X-Axis</button>
                                </div>
                            </div>
                        : null}
                        {(this.state.displayLogButton && this.state.type === 'multi') || this.state.displayMulitBoxLog ? 
                            <div>
                                <div className='col-sm'>
                                    <button className="btn btn-outline-dark" onClick={this.logTransformY}>Log Transform Y-Axis</button>
                                </div>
                            </div>
                        : null}
                        {(this.state.displayBox && this.state.type === 'single' && this.state.downloadSingleColumns !== null && this.state.downloadSingleDatas !== null) ?
                        <div>
                        <div className='col-sm'>
                                <CsvDownloader className='text-align-center'
                                    datas={this.state.downloadSingleDatas}
                                    columns={this.state.downloadSingleColumns}
                                    filename={(this.props.year !== 'SpecialCase') ? 
                                        `${this.props.year}-${parseInt(this.props.year) + 1}_${this.state.xVarName}`:
                                        `2017 - March 2020 Pre-Covid_${this.state.xVarName}`}
                                    extension=".csv"
                                    text="Download Single Variable Data"
                                    noHeader={false}
                                    >
                                    <button className="btn btn-outline-dark" onClick={this.customAlert}>Download Single Variable Data</button>
                                </CsvDownloader>
                            </div>
                        </div>
                        : null}
                        {(this.state.displayBox && this.state.type === 'multi' && this.state.downloadMultipleColumns !== null && this.state.downloadMultipleDatas !== null) ?
                        <div>
                            <div className='col-sm'>
                                <CsvDownloader 
                                    datas={this.state.downloadMultipleDatas}
                                    columns={this.state.downloadMultipleColumns}
                                    filename={(this.props.year !== 'SpecialCase') ? 
                                        `${this.props.year}-${parseInt(this.props.year) + 1}_${this.state.xVarName}_${this.state.yVarName}`:
                                        `2017 - March 2020 Pre-Covid_${this.state.xVarName}_${this.state.yVarName}`}
                                    extension=".csv"
                                    text="Download Multiple Variable Data"
                                    noHeader={false}

                                >
                                    <button className="btn btn-outline-dark" onClick={this.customAlert}>Download Multiple Variable Data</button>
                                </CsvDownloader>
                            </div>
                        </div>
                        : null}
                        {(this.state.type === 'single' && this.state.xVarName !== null && this.state.xVarName !== '' && this.state.displayBox === false) || 
                        (this.state.type === 'multi' && this.state.xVarName !== null && this.state.xVarName !== '' && this.state.yVarName !== null && this.state.yVarName !== '' && this.state.displayBox === false) ?
                            <div className='col-sm'>   
                                <button className="btn btn-outline-dark" onClick={this.handleClick.bind(this)}>Build Graph</button>
                            </div>
                        : null}
                    </div>
                </div>
                
                <div className='row text-center'>
                {/* Handle single box plots */}
                {this.state.displayBox && this.state.graphType === 'Box Plot' && this.state.type === 'single' ? 
                    <div className='container-fluid'>
                        <div className='row align-items-center'>
                            <div className='col-sm-9'>
                                <Boxplot
                                    xData={this.state.xData}
                                    logX={this.state.logDataX}
                                    sasLabel={`${this.state.logDataX ? 'Log':''} ${this.props.variablesDataFile[this.state.xVarName]["sasLabel"]}`}
                                    title={(this.props.year !== 'SpecialCase') ? 
                                        `${this.props.year} - ${parseInt(this.props.year) + 1} : ${this.state.logDataX ? 'Log':''} ${this.state.xVarName}` :
                                        `2017 - March 2020 Pre-Covid : ${this.state.logDataX ? 'Log':''} ${this.state.xVarName}`
                                    }
                                    y_title={`${this.state.logDataX ? 'Log':''} ${this.props.variablesDataFile[this.state.xVarName]["sasLabel"]}`}
                                    handleLoading={this.handleLoading}
                                    xMin = {(this.state.xVarMin !== null ? this.state.xVarMin : null)}
                                    xMax = {(this.state.xVarMax !== null ? this.state.xVarMax : null)}
                                />
                            </div>
                            <div className='col-sm-3'>
                                <br></br>
                                    <div className='row'>
                                        <p> {this.props.variablesDataFile[this.state.xVarName]["sasLabel"]} Minimum:</p>
                                        <input name='xVarMin' type='number' placeholder='Enter a Number' onChange={this.inputCutoffs}></input>
                                    </div>
                                    <br></br>
                                    <div className='row'>
                                        <p> {this.props.variablesDataFile[this.state.xVarName]["sasLabel"]} Maximum:</p>
                                        <input name='xVarMax' type='number' placeholder='Enter a Number' onChange={this.inputCutoffs}></input>
                                    </div>
                            </div>
                        </div>
                    </div> : null}
                {/* Handle single Frequency Table */}
                {this.state.displayBox && this.state.graphType === 'Frequency Table' && this.state.type === 'single' ? 
                    <div className='col-sm'>
                        <br></br>
                        <VariableTable 
                            data={this.state.xData}
                            check={1}
                        />
                    </div> : null}
                {/* Handle Histograms */}
                {this.state.displayBox && this.state.graphType === 'Histogram' && this.state.type === 'single' ? 
                    <div className='container-fluid'>
                        <div className='row align-items-center'>
                            <div className='col-sm-9'>
                                <Histogram
                                    xData={this.state.xData}
                                    logX={this.state.logDataX}
                                    sasLabel={`${this.state.logDataX ? 'Log':''} ${this.props.variablesDataFile[this.state.xVarName]["sasLabel"]}`}
                                    title={(this.props.year !== 'SpecialCase') ? 
                                        `${this.props.year} - ${parseInt(this.props.year) + 1} : ${this.state.logDataX ? 'Log':''} ${this.state.xVarName}` :
                                        `2017 - March 2020 Pre-Covid : ${this.state.logDataX ? 'Log':''} ${this.state.xVarName}`
                                    }
                                    x_title={`${this.state.logDataX ? 'Log':''} ${this.props.variablesDataFile[this.state.xVarName]["sasLabel"]}`}
                                    handleLoading={this.handleLoading}
                                    xMin = {(this.state.xVarMin !== null ? this.state.xVarMin : null)}
                                    xMax = {(this.state.xVarMax !== null ? this.state.xVarMax : null)}
                                />
                            </div>
                            <div className='col-sm-3'>
                                    <br></br>
                                    <div className='row'>
                                        <p> {this.props.variablesDataFile[this.state.xVarName]["sasLabel"]} Minimum:</p>
                                        <input name='xVarMin' type='number' placeholder='Enter a Number' onChange={this.inputCutoffs}></input>
                                    </div>
                                    <br></br>
                                    <div className='row'>
                                        <p> {this.props.variablesDataFile[this.state.xVarName]["sasLabel"]} Maximum:</p>
                                        <input name='xVarMax' type='number' placeholder='Enter a Number' onChange={this.inputCutoffs}></input>
                                    </div>
                                    <br></br>
                            </div>
                        </div>
                    </div> : null}

                </div>
                {/* Handle Scatter Plots */}
                {this.state.displayBox && this.state.graphType === 'Scatter Plot' && this.state.type === 'multi' ? 
                    <div className='container-fluid'>
                            <div className='row align-items-center'>
                                <div className='col-sm-9'>
                                <Scatter
                                    xData={this.state.xData}
                                    logX={this.state.logDataX}
                                    xLabel={`${this.state.logDataX ? 'Log':''} ${this.props.variablesDataFile[this.state.xVarName]["sasLabel"]}`}
                                    logY={this.state.logDataY}
                                    yData={this.state.yData}
                                    yLabel={`${this.state.logDataY ? 'Log':''} ${this.props.variablesDataFile[this.state.yVarName]["sasLabel"]}`}
                                    title={(this.props.year !== 'SpecialCase') ? 
                                        `${this.props.year} - ${parseInt(this.props.year) + 1}: ${this.state.logDataX ? 'Log':''} ${this.state.xVarName} vs ${this.state.logDataY ? 'Log':''} ${this.state.yVarName}` :
                                        `2017 - March 2020 Pre-Covid : ${this.state.logDataX ? 'Log':''} ${this.state.xVarName} vs ${this.state.logDataY ? 'Log':''} ${this.state.yVarName}`
                                        }
                                    handleLoading={this.handleLoading}
                                    xMin = {(this.state.xVarMin !== null ? this.state.xVarMin : null)}
                                    xMax = {(this.state.xVarMax !== null ? this.state.xVarMax : null)}
                                    yMin = {(this.state.yVarMin !== null ? this.state.yVarMin : null)}
                                    yMax = {(this.state.yVarMax !== null ? this.state.yVarMax : null)}
                                />
                            </div>
                            <div className='col-sm-3'>
                                    <br></br>
                                    <div className='row'>
                                        <p> {this.props.variablesDataFile[this.state.xVarName]["sasLabel"]} Minimum:</p>
                                        <input name='xVarMin' type='number' placeholder='Enter a Number' onChange={this.inputCutoffs}></input>
                                    </div>
                                    <br></br>
                                    <div className='row'>
                                        <p> {this.props.variablesDataFile[this.state.xVarName]["sasLabel"]} Maximum:</p>
                                        <input name='xVarMax' type='number' placeholder='Enter a Number' onChange={this.inputCutoffs}></input>
                                    </div>
                                    <br></br>
                                    <hr className='headHR'></hr>
                                    <br></br>
                                    <div className='row'>
                                        <p> {this.props.variablesDataFile[this.state.yVarName]["sasLabel"]} Minimum:</p>
                                        <input name='yVarMin' type='number' placeholder='Enter a Number' onChange={this.inputCutoffs}></input>
                                    </div>
                                    <br></br>
                                    <div className='row'>
                                        <p> {this.props.variablesDataFile[this.state.yVarName]["sasLabel"]} Maximum:</p>
                                        <input name='yVarMax' type='number' placeholder='Enter a Number' onChange={this.inputCutoffs}></input>
                                    </div>
                            </div>
                        </div>
                    </div> : null}
                
                {/* Handle MultiBoxPlot */}
                {this.state.displayBox && this.state.graphType === 'Box Plot' && this.state.type === 'multi' ? 
                <div className='container-fluid'>
                        <div className='row align-items-center'>
                            <div className='col-sm-9'>
                                <MultiBoxplot
                                    data={this.state.multiBoxData}
                                    logY={this.state.logDataY}
                                    catLabels={this.props.categoricalLabels}
                                    xLabel={`${this.state.xVarName}`}
                                    xAxis={`${this.state.xVarName} - ${this.props.variablesDataFile[this.state.xVarName]["sasLabel"]}`}
                                    yLabel={`${this.state.yVarName}`}
                                    yAxis={`${this.state.logDataY ? 'Log':''} ${this.state.yVarName} - ${this.props.variablesDataFile[this.state.yVarName]["sasLabel"]}`}
                                    title={(this.props.year !== 'SpecialCase') ? 
                                        `${this.props.year} - ${parseInt(this.props.year) + 1}: ${this.state.logDataX ? 'Log':''} ${this.state.xVarName} vs ${this.state.logDataY ? 'Log':''} ${this.state.yVarName}` :
                                        `2017 - March 2020 Pre-Covid : ${this.state.logDataX ? 'Log':''} ${this.state.xVarName} vs ${this.state.logDataY ? 'Log':''} ${this.state.yVarName}`
                                        }
                                    handleLoading={this.handleLoading}
                                    yMin = {(this.state.yVarMin !== null ? this.state.yVarMin : null)}
                                    yMax = {(this.state.yVarMax !== null ? this.state.yVarMax : null)}
                                />
                            </div>
                            <div className='col-sm-3'>
                                <br></br>
                                    <div className='row'>
                                        <p> {this.props.variablesDataFile[this.state.yVarName]["sasLabel"]} Minimum:</p>
                                        <input name='yVarMin' type='number' placeholder='Enter a Number' onChange={this.inputCutoffs}></input>
                                    </div>
                                    <br></br>
                                    <div className='row'>
                                        <p> {this.props.variablesDataFile[this.state.yVarName]["sasLabel"]} Maximum:</p>
                                        <input name='yVarMax' type='number' placeholder='Enter a Number' onChange={this.inputCutoffs}></input>
                                    </div>
                            </div>
                        </div>
                    </div> : null}
                
                {/* Handle Frequency Crosstab */}
                {this.state.displayBox && this.state.graphType === 'Frequency Table' && this.state.type === 'multi' ?
                 <div className='container'>
                     <div className='col-lg'>
                     <br></br>
                        <CrosstabTable
                            data={this.state.crosstabData}
                            xVar={this.state.xVarName}
                            xLabel={this.props.variablesDataFile[this.state.xVarName]["sasLabel"]}
                            yVar={this.state.yVarName}
                            yLabel={this.props.variablesDataFile[this.state.yVarName]["sasLabel"]}
                            labels={this.props.categoricalLabels}
                            handleLoading={this.handleLoading}
                        />
                     </div>
                 </div> : null}
            </div>
        )
    }
}

export default Analysis