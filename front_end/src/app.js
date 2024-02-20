import React from 'react'

// my imports
import Header from './components/Header.js'
import YearDataForm from './components/YearDataForm.js'

class App extends React.Component {
    // Change the browser tab title
    componentDidMount() {
        document.title = 'NHANES Data Explorer';
    }

    // renders the header at all stages
    // initializes page with the first form
    render() {
        return (
            <div>
                <Header/>
                <YearDataForm/>
            </div>
        )
    }
}

export default App