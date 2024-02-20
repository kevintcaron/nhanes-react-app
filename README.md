# Building Tools for Tobacco Exposure Biomarker Research by linking Python Data Mining of NHANES Databases with Data Analytics and Visualization
Team: Steve, Aaron, Kevin
The goal of this project is to provide a tool that better connects the user with producing summary statistics and histograms for publication of the data that they have generated in the lab without having a background in SAS or Python coding.

*N10.a. Title:  

Building Tools for Tobacco Exposure Biomarker Research by linking Python Data Mining of NHANES/NAHDAP Databases with SAS Data Analytics and Visualization. 

 

*N10.b. Public Health Background and Significance (importance to CIO, agency initiatives): 

Despite a gradual decline in the prevalence of cigarette smoking and increased awareness about the risks associated with tobacco use, smoking remains the leading cause of preventable death and disability in the United States.  In a 2014 report outlining 50 years of progress, the Office of the Surgeon General affirmed a causal relationship between smoking and a large number of chronic diseases and cancers including cancer of the liver, colon and rectum, lung, oral cavity and throat as well as stroke, chronic obstructive pulmonary disease, and coronary heart disease.  As one of CDC’s Winnable Battles, the Million Hearts initiative has named decreasing tobacco use a key strategy toward preventing 1 million heart attacks by 2022. The Division of Laboratory Science’s (DLS) Tobacco and Volatiles Branch (TVB) provides laboratory science that reduces individual and population exposure to addictive and toxic substances in tobacco products. One of TVB’s primary functions is to identify and track trends in Americans’ tobacco use and secondhand smoke exposure.  TVB’s Tobacco Exposure Biomarkers Laboratory (TEBL) conducts assessments of the percent of persons who are smokers by measuring serum cotinine levels, exposure to the major toxic constituents (such as tobacco-specific nitrosamines, aromatic amines, polycyclic aromatic hydrocarbons, and benzene) of tobacco smoke, and exposure to secondhand smoke, among Americans every two years.  Analysis of data produced by TEBL has led to the observation of concerning health outcomes and the implementation of effective public health responses.  For example, in the early 1990s measurements of cotinine (a nicotine biomarker) demonstrated that 88% of nonsmoking Americans were exposed to tobacco smoke.  This prompted the enactment of smoking restrictions in public buildings. Follow-up findings, highlighted in the 2006 Surgeon General’s Report, showed a dramatic reduction in secondhand smoke exposure as a result of interventions. Successful public health responses require the ability to access and interact with data quickly and easily.  By making more tools for interacting with data available to scientists who may not have programming experience, TEBL and CDC will increase our ability to monitor trends in exposure, evaluate health policy, and respond to emerging threats to public health. 

 

*N10.c. Problem Statement (current state and future state): 

Currently there is not enough time for evaluating results obtained by the labs because of the difficulty in working with post processed data and connecting it with reliable statistical methods. In the future, a method lead, analyst, or data scientist would be able to use the developed tools to access the data in NHANES and NAHDAP databases and produce summary statistics and histograms for viewing their data in meaningful ways. 

 

*N10.d. Goals(s) and SMART Objectives4: 

The goal of this project is to provide a tool that better connects the user with producing summary statistics and histograms for publication of the data that they have generated in the lab without having a background in SAS or Python coding. Objectives are to write python code that will search NHANES and NAHDAP databases for newly published Tobacco Exposure Biomarkers data as it comes available. Current serum cotinine, urinary nicotine metabolites, and tobacco-specific nitrosamines data sets will be used for testing the code. The code will allow users to specify analytes of interest for analysis. The downloaded data will then be formatted into a standardized format that can be passed to SAS for statistical analysis. Python and SAS APIs are available to link the Python code with somewhat less user-friendly SAS coding. Summary statistics and histograms will be produced by SAS on the selected data set. The user would be able to import the derived statistics and well formatted histograms directly into manuscripts that they are working on. 

 

*N10.e. Proposed Methods: 

Python scripting and SAS summary statistics, histogram and mapping visualization capabilities. 

 

*N10.f. Expected Outcomes and Impact: 

The expected outcome of this project is a developed tool that allows the user to point to a data source, input variables and parameters that then links with SAS to produce high quality histograms and accurate summary statistics. The impact will add high quality publishable data that can further the knowledge of the current state of tobacco use and exposure in the US population. 