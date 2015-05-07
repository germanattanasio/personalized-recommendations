# World of Watson Labs - Personalized Recommendations

This lab is part of a Drop In Lab during World of Watson 2015 at NYC. It will take you through several of the [Watson Services][] that are available on [Bluemix][] to build a simple travel advisor application. Throughout the workshop, we will navigate through Bluemix, Github, and the source code of our application in order to demonstrate how apps can be created quickly and easily using the Bluemix platform, and the value of providing Watson and Cognitive capabilities through APIs.

So let’s get started. The first thing to do is to build out the shell of our application in Bluemix.

## Creating a Bluemix Account

  1. Go to https://ace.ng.bluemix.net/
  2. Create a Bluemix account if required.
  3. Log in with your IBM ID (the ID used to create your Bluemix account) 

**Note:** The confirmation email from Bluemix mail take up to 1 hour.

## Deploy this sample application in Bluemix

  1. Click the button below to fork into IBM DevOps Services and deploy your own copy of this application on Bluemix.

  [![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://github.com/germanattanasio/personalized-recommendations)

  2. From here you will be taken to a Bluemix page, where you will be prompted to name your app. A sample name is provided for you, but feel free to give your application any name you like (if the name is taken by another user you will be prompted to try another name).

  Note: use the default settings for Region / Organization / Space on the Bluemix landing page.

  3. Once you have named your application, click the deploy button to begin the deploy process to Bluemix. During this process, Bluemix will automatically build and deploy our starter application based on the Github repository that we accessed at the start of the lab.

  4. Once the application is finished deploying, you will see a “Success!” message. At this point, scroll to the top of the page and select “Dashboard” from the header bar.

  5. Test Out the new app. Now that we have deployed our application to Bluemix, the next step is to test out the application in its current state. Afterwards we will build out more functionality into the application.

## Modify the existing application

  1. Let’s edit our source code. Back on the application home page in Bluemix, you will see a link to the Jazz Hub repository, and a button to **Edit Code**.
  Click on **Edit Code.**

  2. Within the repository, navigate to `app.js` and open that file to view the application source code.

  3. Locate the comment starting in line 107: `// tradeoff analytics REST call - here`. Copy the code below under that line:
  ```js
  app.post('/dilemmas', function(req, res, next) {
    tradeoffAnalytics.dilemmas(req.body, function(err, dilemmas) {
      if (err)
        return next(err);
      else
        return res.json(dilemmas);
    });
  });
  ```
  The code above will connect the app to the Tradeoff Analytics service.
  4. Locate the comment starting in line 117: `// question and answer REST call - here`. Copy the code below under that line:
  ```js
  app.get('/ask_question', function(req, res, next) {
    questionAndAnswer.ask(req.query, function(err, pipelines) {
      if (err)
        return next(err);
      else {
        return res.json(pipelines[0].question.evidencelist);
      }
    });
  });
  ```
  The code above will connect the app to the Question and Answer service
  5. Click on File -> Save or press Crt+S.

  IMAGE HERE: SAVE CODE

## Deploy

  1. First we are deploying the changes to the internal Git repository. Switch to the Git view, the 3rd icon in the left nagivation bar.

  IMAGE HERE: GIT ICON

  2. Locate your change to app.js file. Check it (select it), add a commit message, and click **Commit**.

  3. Click **Sync** to send your changes from this workspace to the main repository and trigger a deploy of your app.

  IMAGE HERE: SYNC BUTTON

  4. Finally, Click on **Build and Deploy** to see the deploy process.

**Note:** While this may show as overly complicated, we show it here to illustrate you can have exactly the same source management practices you could have your local environment connected to a Git repository, in the Bluemix DevOps environment.


## Test

To test out our application, navigate back to your application homepage on Bluemix. Select the URL next to *Route* in the same way that we launched our previously unfinished application before.

IMAGE HERE: APP RUNNING

On the application page, type a concept (e.g. *snorkel*) and click the concept from the dropdown. A background will be started, showing vacations cities from Concept Insights service. You could use this call Tradeoff Analytics or Question and Answer.

**Congratulations**, you have completed the Personalized Recommendations Lab!