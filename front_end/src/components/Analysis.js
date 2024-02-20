import React from 'react'
import CSVLink from 'react-csv'
import Boxplot from '../components/Boxplot.js'
import Histogram from '../components/Histogram.js'
import Scatter from '../components/Scatter.js'
import MultiBoxplot from '../components/MultiBoxplot.js'

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

            displayLogButton: false,
            displayMultiBoxLog:false,
            logDataX:false,
            logDataY: false,

            displayBox: false,
            displayLoading: false
        }
        this.handleClick = this.handleClick.bind(this)
        this.handleDownload = this.handleDownload.bind(this)
        this.selectType = this.selectType.bind(this)
        this.selectGraphType = this.selectGraphType.bind(this)
        this.selectXVar = this.selectXVar.bind(this)
        this.selectYVar = this.selectYVar.bind(this)
        this.logTransformX = this.logTransformX.bind(this)
        this.logTransformY = this.logTransformY.bind(this)
        this.handleLoading = this.handleLoading.bind(this)
    }

    // function defined in VariableSelectForm, dismounts the previous form when loaded
    componentDidMount() {
        this.props.load()
        console.log(this.props.variablesDataFile)
        console.log(this.props.categoricalLabels)

        const contOptions = this.props.continuousVars.map(ea => <option key={ea} value={ea}>{ea}</option>)
        const catOptions = this.props.categoricalVars.map(ea => <option key={ea} value={ea}>{ea}</option>)

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
        const multiGraphs = ['Scatter Plot', 'Box Plot']
        const singleGraphs = ['Histogram', 'Box Plot']
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
            displayMultiBoxLog: false
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
            displayMultiBoxLog: false
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
            displayMultiBoxLog: false
        })
    }

    selectYVar(event) {
        this.setState({
            yVarName: event.target.value,
            logDataX: false,
            logDataY: false,
            displayBox: false,
            displayLogButton: false,
            displayMultiBoxLog: false
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

    // test function for new backend route
    handleClick() {
        if(this.state.xVarName !== null && this.state.type === 'single') {
            this.setState({displayLoading: true})
            fetch(`getData/${this.props.year}/${this.props.variablesDataFile[this.state.xVarName]["xptPath"]}/${[this.state.xVarName]}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.setState({
                    xData: Object.values(data[this.state.xVarName]),
                    displayBox: true,
                    displayLogButton: true
                })
            })
        } else if(this.state.type === 'multi' && this.state.xVarName !== null && this.state.yVarName !== null && this.state.graphType !== 'Box Plot') {
            if(this.state.xVarName !== this.state.yVarName) {
            this.setState({displayLoading: true})
            fetch(`getDataXY/${this.props.year}/${this.props.variablesDataFile[this.state.xVarName]["xptPath"]}-${this.props.variablesDataFile[this.state.yVarName]["xptPath"]}/${this.state.xVarName}-${this.state.yVarName}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.setState({
                    xData: Object.values(data[this.state.xVarName]),
                    yData: Object.values(data[this.state.yVarName]),
                    displayBox: true,
                    displayLogButton: true,
                    displayLoading: true
                })
                // Added to handle the trival case of a scatter plot with the same variable
            })} else if(this.state.xVarName === this.state.yVarName) {
                this.setState({displayLoading: true})
                fetch(`getData/${this.props.year}/${this.props.variablesDataFile[this.state.xVarName]["xptPath"]}/${[this.state.xVarName]}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    this.setState({
                        xData: Object.values(data[this.state.xVarName]),
                        yData: Object.values(data[this.state.xVarName]),
                        displayBox: true,
                        displayLogButton: true,
                        displayLoading: true
                    })
                })
            }
        } else if(this.state.type === 'multi' && this.state.xVarName !== null && this.state.yVarName !== null && this.state.graphType === 'Box Plot') {
            this.setState({displayLoading: true})
            fetch(`getDataXYBoxPlot/${this.props.year}/${this.props.variablesDataFile[this.state.xVarName]["xptPath"]}-${this.props.variablesDataFile[this.state.yVarName]["xptPath"]}/${this.state.xVarName}-${this.state.yVarName}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.setState({
                    displayBox: true,
                    multiBoxData: data,
                    displayMultiBoxLog: true,
                    displayLoading: true
                })
            })
        }
    }

    render() {
        return (
            <div>
                <div>
                    {/* displays the selected NHANES variable codes selected previous form */}
                    <p> <b>NHANES Year:</b> {this.props.year}-{parseInt(this.props.year)+1}</p>
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
                {/* <p>{this.state.type}-{this.state.graphType}-{this.state.xVarName}-{this.state.yVarName}</p> */}
                <div className='row'>
                        <div className='col-sm'>
                        <br></br>
                        {this.state.displayLoading ? <div className="alert alert-success" role="alert">
                                                                Loading Data from API...
                                                        </div> : null}
                        <br></br>
                        </div>
                </div>
                <div className='row'>
                    {this.state.displayLogButton ? 
                        <div className='col-sm'>
                            <button onClick={this.logTransformX}>Log Transform X-Axis</button>
                        </div>
                    : null}
                    {(this.state.displayLogButton && this.state.type === 'multi') || this.state.displayMultiBoxLog ?
                        <div className='col-sm'>
                            <button onClick={this.logTransformY}>Log Transform Y-Axis</button>
                        </div>
                    : null}
                    {(this.state.type === 'single' && this.state.xVarName !== null && this.state.xVarName !== '') || 
                     (this.state.type === 'multi' && this.state.xVarName !== null && this.state.xVarName !== '' && this.state.yVarName !== null && this.state.yVarName !== '') ?
                        <div className='col-sm'>   
                            <button onClick={this.handleDownload}>Download Data</button>
                        </div>
                    : null}
                    {(this.state.type === 'single' && this.state.xVarName !== null && this.state.xVarName !== '') ||
                     (this.state.type === 'multi' && this.state.xVarName !== null && this.state.xVarName !== '' && this.state.yVarName !== null && this.state.yVarName !== '') ?
                        <div className='col-sm'>
                            <button onClick={this.handleClick}>Build Graph</button>
                        </div>
                    : null}
                </div>
                
                <div className='row text-center'>
                {/* Handle single box plots */}
                {this.state.displayBox && this.state.graphType === 'Box Plot' && this.state.type === 'single' ? 
                    <div className='col-sm'>
                        <Boxplot
                            xData={this.state.xData}
                            logX={this.state.logDataX}
                            sasLabel={`${this.state.logDataX ? 'Log':''} ${this.props.variablesDataFile[this.state.xVarName]["sasLabel"]}`}
                            title={`${this.props.year} - ${parseInt(this.props.year) + 1} : ${this.state.logDataX ? 'Log':''} ${this.state.xVarName}`}
                            y_title={`${this.state.logDataX ? 'Log':''} ${this.props.variablesDataFile[this.state.xVarName]["sasLabel"]}`}
                            handleLoading={this.handleLoading}
                        />
                    </div> : null}
                
                {/* Handle Histograms */}
                {this.state.displayBox && this.state.graphType === 'Histogram' && this.state.type === 'single' ? 
                    <div className='col-sm'>
                        <Histogram
                            xData={this.state.xData}
                            logX={this.state.logDataX}
                            sasLabel={`${this.state.logDataX ? 'Log':''} ${this.props.variablesDataFile[this.state.xVarName]["sasLabel"]}`}
                            title={`${this.props.year} - ${parseInt(this.props.year) + 1} : ${this.state.logDataX ? 'Log':''} ${this.state.xVarName}`}
                            x_title={`${this.state.logDataX ? 'Log':''} ${this.props.variablesDataFile[this.state.xVarName]["sasLabel"]}`}
                            handleLoading={this.handleLoading}
                        />
                    </div> : null}

                </div>

                {/* Handle Scatter Plots */}
                {this.state.displayBox && this.state.graphType === 'Scatter Plot' && this.state.type === 'multi' ? 
                    <div className='col-sm'>
                        <Scatter
                            xData={this.state.xData}
                            logX={this.state.logDataX}
                            xLabel={`${this.state.logDataX ? 'Log':''} ${this.props.variablesDataFile[this.state.xVarName]["sasLabel"]}`}
                            logY={this.state.logDataY}
                            yData={this.state.yData}
                            yLabel={`${this.state.logDataY ? 'Log':''} ${this.props.variablesDataFile[this.state.yVarName]["sasLabel"]}`}
                            title={`${this.props.year} - ${parseInt(this.props.year) + 1}: ${this.state.logDataX ? 'Log':''} ${this.state.xVarName} vs ${this.state.logDataY ? 'Log':''} ${this.state.yVarName}`}
                            handleLoading={this.handleLoading}
                        />
                    </div> : null}
                
                {/* Handle MultiBoxPlot */}
                {this.state.displayBox && this.state.graphType === 'Box Plot' && this.state.type === 'multi' ? 
                    <div className='container'>
                        <div className='col-lg'>
                        <MultiBoxplot
                            data={this.state.multiBoxData}
                            logY={this.state.logDataY}
                            catLabels={this.props.categoricalLabels}
                            xLabel={`${this.state.xVarName}`}
                            xAxis={`${this.state.xVarName} - ${this.props.variablesDataFile[this.state.xVarName]["sasLabel"]}`}
                            yLabel={`${this.state.yVarName}`}
                            yAxis={`${this.state.logDataY ? 'Log':''} ${this.state.yVarName} - ${this.props.variablesDataFile[this.state.yVarName]["sasLabel"]}`}
                            title={`${this.props.year} - ${parseInt(this.props.year) + 1}: ${this.state.xVarName} vs ${this.state.logDataY ? 'Log':''} ${this.state.yVarName}`}
                            handleLoading={this.handleLoading}
                        />
                        </div>
                    </div> : null}
            </div>
        )
    }
}

export default Analysis