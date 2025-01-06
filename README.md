## [Live site here](https://runtacker.netlify.app)

## Why this project?

So my girlfriend got me a Fitbit for me birthday...

I had just started getting into running, and I found that Fitbit's data visualisation didn't allow for direct comparison of exercises (and I felt I needed more practice with APIs and wanted to learn a chart library) so I decided to make a dashboard for tracking my runs.


## About this project

This is a custom made dashboard that visualises all tracked runs made through the Fitbit API.  

![page](docs/images/page.png)

### Features:
* List of all runs made with comparisons to last run:  
![runList](docs/images/runList.png)
* Overall stats across all runs:  
![overallStats](docs/images/overallStats.png)
* All runs shown in line chart with option for trend line and predicted next run:  
![allRuns](docs/images/allRuns.png)
* Selected run data over time in a line chart:  
![selectedGraph](docs/images/selectedGraph.png)
* Selected run data as ratios in pie chart:  
![pieChart](docs/images/pieChart.png)
* Selected run data as statistics:  
![selectedStats](docs/images/selectedStats.png)
* Predicted next run's stats based on previous runs:  
![predictedStats](docs/images/predictedStats.png)

### Built using:
* [Fitbit API](https://www.fitbit.com/dev)
* [React](https://react.dev/)
* [Recharts](https://recharts.org/en-US/)

### Acknowledgements:
* [heofs for their trendline code](https://github.com/heofs/trendline?tab=readme-ov-file)
* [Cotter for their code verifier/challenge](https://docs.cotter.app/sdk-reference/api-for-other-mobile-apps/api-for-mobile-apps#step-1-create-a-code-verifier)