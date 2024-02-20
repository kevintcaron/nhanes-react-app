import React from 'react'
import '../style.css'

function Header() {
    // Page header, contains a Description of the page, a link to documentation, 
    // and a refresh button
    return (
        <div className='container'>
            <hr className='headHR'></hr>
            <h1 className='text-center'>
                Welcome to the TEBL NHANES Data Analysis Tool
            </h1>
            <p className='text-center'>To view official NHANES documentation for 
                specific years and or survey questions click 
                <b><a href="https://wwwn.cdc.gov/nchs/nhanes/Default.aspx" target="_blank" rel="noreferrer"> here.</a></b>
            </p>
            <p>
              To start exploring NHANES data, you will need to select both a survey year, 
              and the type of data (questionnaire) that you want to explore.
            </p>
            <div className='col-sm text-center'>
                <button 
                    type="button justify-center" 
                    className="btn btn-outline-info btn-sm"
                    onClick={() => window.location.reload(false)} >Click to Restart</button>
            </div>
            <hr className='headHR'></hr>
        </div>
    )
}

export default Header