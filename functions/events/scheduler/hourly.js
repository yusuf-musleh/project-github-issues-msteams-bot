const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

const { groupIssuesByAssignees } = require('../../../helpers/helpers.js');

/**
* An HTTP endpoint that acts as a webhook for Scheduler hourly event
* @returns {object} result Your return value
*/
module.exports = async () => {

  // Store API Responses
  const result = {};
  
  let issues = await lib.github.issues['@0.3.5'].listForRepo({
    owner: `yusuf-musleh`,
    repo: `test-repo`
  });
  
  let openIssues = issues.filter((issue) => issue.state === 'open');
  
  let issuesGroupedByAssignee = groupIssuesByAssignees(openIssues);
  
  let msUserNames = Object.keys(issuesGroupedByAssignee);
  
  
  for (let i = 0; i < msUserNames.length; i++) {
    let userAndIssueData = issuesGroupedByAssignee[msUserNames[i]];
    
    let listOfIssuesText = '';
    for (let j = 0; j < userAndIssueData.length; j++) {
      listOfIssuesText += `<br> - [${userAndIssueData[j].issueTitle}](${userAndIssueData[j].issueUrl})`
    } 
    
    let messagePayload = {
      channel: `Github Issues`,
      body: `Hey <at>${msUserNames[i]}</at>, the following issue(s) are still open on Github, please work on them when you can:${listOfIssuesText}`,
      mentions: [{
        text: `<at>${msUserNames[i]}</at>`,
        userId: `${userAndIssueData[0].userId}`
      }]
    }
    
    await lib.microsoftteams.messages['@dev'].create(messagePayload);
    
  }
  

  return result;

};