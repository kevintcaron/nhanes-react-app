# import dependencies
from bs4 import BeautifulSoup
import requests
import pandas as pd
import json
import requests

def apiComponentYear(year, questionnaires):
    result_dict = {}
    for q in questionnaires:
        # grab html of page with requests
        url = f'https://wwwn.cdc.gov/nchs/nhanes/search/datapage.aspx?Component={q}&CycleBeginYear={year}'
        page = requests.get(url)
        extension = 'https://wwwn.cdc.gov/'

        if page.status_code == 200:
            # set up empty vars
            page_dict = {}

            analyte = []
            doc_file = []
            doc_file_link = []
            data_file = []
            data_file_link = []
            published = []

            # pass it to bs4 and parse with lxml
            content = page.content
            soup = BeautifulSoup(content, features="lxml")
            # parse out table and rows and remove header row
            for row in soup.find('table').find_all('tr')[1:]:
                # add each rows data to corresponding list
                tds = row.find_all('td')
                links = row.find_all('a')
                try:
                    page_dict[tds[0].text] = {
                        'Analyte': tds[0].text,
                        'Doc File': tds[1].text,
                        'Doc Url': extension + links[0]['href'],
                        'Data File': tds[2].text,
                        'Data Url': extension + links[1]['href'],
                        'Published Date': tds[3].text
                    }
                except:
                    page_dict[tds[0].text] = {
                        'Analyte': tds[0].text,
                        'Doc File': tds[1].text,
                        'Doc Url': 'No URL',
                        'Data File': tds[2].text,
                        'Data Url': 'No URL',
                        'Published Date': tds[3].text
                    }

            result_dict[q] = page_dict

        else:
            result_dict[q] = 'Could not reach {}'.format(url)
    return result_dict


def scrapeDocumentation(year, doc):
    url = f"https://wwwn.cdc.gov//Nchs/Nhanes/{year}/{doc}"
    print(url)
    # grab html of page with requests
    page = requests.get(url)
    # pass it to bs4 and parse with lxml
    content = page.content
    soup = BeautifulSoup(content, features="lxml")
    
    extension = 'https://wwwn.cdc.gov/'
    print(page.status_code)
    
    if page.status_code == 200:
        variable_dict = {}
        for page in soup.find_all('div', class_='pagebreak'):
            var_dict = {}
            dts = []
            dds = []
            for dt in page.find_all('dt'):
                dt = dt.text
                dt = dt.split(':')
                dts.append(dt[0])
            for dd in page.find_all('dd'):
                dds.append(dd.text.strip())
            for i in range(len(dts)):
                var_dict[dts[i]] = dds[i]
                
            try:
                table = page.find('table')
                df = pd.read_html(table.prettify())
                df = df[0].to_json(orient='split')
                parsed = json.loads(df)
                var_dict['DataFrame'] = parsed
            except:
                var_dict['DataFrame'] = 0
                
            variable_dict[dds[0]] = var_dict
        # cleaning up returned text    
        for each in variable_dict.keys():
            variable_dict[each]['Target'] = variable_dict[each]['Target'].replace('\r\n\t\t\t', ' ')
    else:
        variable_dict = {'Status': 404}
    
    return variable_dict


def singleVarDownload(year, file_name, var):
    # format doc url
    year = year + '-' + str(int(year) + 1)
    url = f'https://wwwn.cdc.gov//Nchs/Nhanes/{year}/{file_name}.XPT'

    # download the xpt file, and convert to DataFrame
    download = requests.get(url).content
    with open('Data/test.xpt', 'wb') as f:
        f.write(download)
    df = pd.read_sas('Data/test.xpt')
    df = df[['SEQN', var]].dropna(axis=0, how='any')
    df = df[df[var] != 5.397605346934028e-79]

    df = df.to_json()
    parsed = json.loads(df)
    
    return parsed

def singleVarDownload2Host(year, file_name, var):
    # format doc url
    year = year + '-' + str(int(year) + 1)
    url = f'https://wwwn.cdc.gov//Nchs/Nhanes/{year}/{file_name}.XPT'

    # download the xpt file, and convert to DataFrame
    download = requests.get(url).content
    with open('Data/test.xpt', 'wb') as f:
        f.write(download)
    df = pd.read_sas('Data/test.xpt')
    df = df[['SEQN', var]].dropna(axis=0, how='any')
    df = df[df[var] != 5.397605346934028e-79]

    csv = df.to_csv()

    return csv

def multiVarDownload(year, fileX, varX, fileY, varY):
    year = year + '-' + str(int(year) + 1)
    urlX = f'https://wwwn.cdc.gov//Nchs/Nhanes/{year}/{fileX}.XPT'
    urlY = f'https://wwwn.cdc.gov//Nchs/Nhanes/{year}/{fileY}.XPT'
    
    downloadX = requests.get(urlX).content
    with open('Data/testX.xpt', 'wb') as fX:
        fX.write(downloadX)
    dfX = pd.read_sas('Data/testX.xpt')
    dfX = dfX[['SEQN', varX]].dropna(axis=0, how='any')
    dfX = dfX[dfX[varX] != 5.397605346934028e-79]
    
    downloadY = requests.get(urlY).content
    with open('Data/testY.xpt', 'wb') as fY:
        fY.write(downloadY)
    dfY = pd.read_sas('Data/testY.xpt')
    dfY = dfY[['SEQN', varY]].dropna(axis=0, how='any')
    dfY = dfY[dfY[varY] != 5.397605346934028e-79]
    
    dfMerged = dfX.merge(dfY, on='SEQN', how='inner')
    df_json = dfMerged.to_json()
    parsed = json.loads(df_json)
    
    return parsed

def multiVarDownloadBoxPlot(year, fileX, varX, fileY, varY):
    year = year + '-' + str(int(year) + 1)
    urlX = f'https://wwwn.cdc.gov//Nchs/Nhanes/{year}/{fileX}.XPT'
    urlY = f'https://wwwn.cdc.gov//Nchs/Nhanes/{year}/{fileY}.XPT'
    
    downloadX = requests.get(urlX).content
    with open('Data/testX.xpt', 'wb') as fX:
        fX.write(downloadX)
    dfX = pd.read_sas('Data/testX.xpt')
    dfX = dfX[['SEQN', varX]].dropna(axis=0, how='any')
    
    downloadY = requests.get(urlY).content
    with open('Data/testY.xpt', 'wb') as fY:
        fY.write(downloadY)
    dfY = pd.read_sas('Data/testY.xpt')
    dfY = dfY[['SEQN', varY]].dropna(axis=0, how='any')
    dfY = dfY[dfY[varY] != 5.397605346934028e-79]
    
    dfMerged = dfX.merge(dfY, on='SEQN', how='inner')
    
    result = {}
    cats = set(dfMerged[varX])
    for cat in cats:
        result[cat] = list(dfMerged[dfMerged[varX] == cat][varY])
    
    return result