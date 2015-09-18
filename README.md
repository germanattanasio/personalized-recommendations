# Personalized Recommendations

  Personalized Recommendations is a tool that helps you find the best vacation spots to go to.  This app uses three Watson:
  * [Concept Insights](http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/concept-insights.html) searches for your relevant places.
  * [Tradeoff Analytics](http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/tradeoff-analytics.html) helps decide which place is best.
  * [Question and Answer](http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/question-answer.html) answers your questions about those places.

Demo: http://personalized-recommendations.mybluemix.net/

Give it a try! Click the button below to fork into IBM DevOps Services and deploy your own copy of this application on Bluemix.

[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://github.com/Repjarms/personalized-recommendations)

## Running locally
  The application uses [Node.js](http://nodejs.org/) and [npm](https://www.npmjs.com/) so you will have to download and install them as part of the steps below.

1. Open a terminal and run:  
    `git clone git@github.com:watson-developer-cloud/personalized-recommendations.git`
2. Change the directory to personalized-recommendations 
    `cd personalized-recommendations`
3. Copy the credentials from your services in Bluemix to `app.js`, you can see the credentials by going to your app in Bluemix and cliking on "See credentials".
4. Install [Node.js](http://nodejs.org/) and [npm](https://github.com/npm/npm)
5. Go to the project folder in a terminal and run:  
    `npm install`
6. Start the application
7.  `node app.js`
8. Go to `http://localhost:3000`


## License

  This sample code is licensed under Apache 2.0. Full license text is available in [LICENSE](LICENSE).  
  This sample code is using jQuery which is licensed under MIT.  

## Contributing

  See [CONTRIBUTING](CONTRIBUTING.md).

## Open Source @ IBM
  Find more open source projects on the [IBM Github Page](http://ibm.github.io/)
