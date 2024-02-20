# importing dependencies
from flask import render_template, url_for, redirect, flash, request
from datetime import datetime

# importing own code
from app import app
from functions import *

# this route is just for confirming that the back end is running
@app.route('/', methods=['GET', 'POST'])
def home():
    loaded = datetime.now()
    current_time = loaded.strftime("%H:%M:%S")

    return render_template('index.html', loaded = str(current_time))

# this route is called by the YearData componenet to scrape all possible questionnaires
# the user requested from that year
@app.route('/YearComp/<string:year>/<string:components>', methods=['GET', 'POST'])
def YearComp(year, components):

    components = components.split('-')
    result = apiComponentYear(year, components)

    return result

# this route is called by the VariableSelect component. It scrapes the documentation page
# for the currently selected questionnaire to display all variables associated with that questionnaire
@app.route('/SurveyDoc/<string:year>/<string:doc>', methods=['GET', 'POST'])
def SurveyDoc(year, doc):
    if year != 'SpecialCase':
        yearFmt = year + '-' + str(int(year) + 1)
    elif year == 'SpecialCase':
        yearFmt = '2017-2018'
    docFmt = doc.replace(' Doc','.htm')
    result = scrapeDocumentation(yearFmt, docFmt)

    return result

# this route is called to request the xpt files hosted on the NHANES website
@app.route('/getData/<string:year>/<string:data_file>/<string:var>', methods=['GET','POST'])
def getData(year, data_file, var):
    result = singleVarDownload(year, data_file, var)

    return result


# this route is called to request the xpt files hosted on the NHANES website
@app.route('/getDownload/<string:year>/<string:data_file>/<string:var>', methods=['GET', 'POST'])
def getDownload(year, data_file, var):
    result = singleVarDownload2Host(year, data_file, var)

    return result

# this route is called to get an xpt file for an X & Y variable and returns a merged dataset
@app.route('/getDataXY/<string:year>/<string:data_file>/<string:var>', methods=['GET','POST'])
def getDataXY(year, data_file, var):
    varX = var.split('-')[0]
    varY = var.split('-')[1]
    data_fileX = data_file.split('-')[0]
    data_fileY = data_file.split('-')[1]

    result = multiVarDownload(year, data_fileX, varX, data_fileY, varY)

    return result

# this route is called to get an xpt file for an X & Y variable and returns a merged dataset for Boxplot use
@app.route('/getDataXYBoxPlot/<string:year>/<string:data_file>/<string:var>', methods=['GET','POST'])
def getDataXYBoxPlot(year, data_file, var):
    varX = var.split('-')[0]
    varY = var.split('-')[1]
    data_fileX = data_file.split('-')[0]
    data_fileY = data_file.split('-')[1]

    result = multiVarDownloadBoxPlot(year, data_fileX, varX, data_fileY, varY)

    return result

# this route is called to get an xpt file for an X & Y categorical variables for a cross tab, returns an object
@app.route('/getCrosstabXY/<string:year>/<string:data_file>/<string:var>', methods=['GET','POST'])
def getCrosstabXY(year, data_file, var):
    varX = var.split('-')[0]
    varY = var.split('-')[1]
    data_fileX = data_file.split('-')[0]
    data_fileY = data_file.split('-')[1]

    result = getCrosstabData(year, data_fileX, varX, data_fileY, varY)
                
    return result