const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

const { getMsTeamsUserFromGithubUser } = require('../../../helpers/helpers.js');

/**
* An HTTP endpoint that acts as a webhook for GitHub issues event
* @param {object} event
* @returns {object} result Your return value
*/
module.exports = async (event) => {

  // Store API Responses
  const result = {};

  let messagePayload = {
    channel: 'Github Issues'
  };
  
  let issueOpener = event.issue.user.login;
  let issue = event.issue;
  let repository = event.repository.full_name;
  
  let issueUrl =`https://github.com/${repository}/issues/${issue.number}/`
  
  let assignee = event.issue.assignee ? event.issue.assignee.login : "Unassigned";
  let msUser = getMsTeamsUserFromGithubUser(assignee);
  
  if (msUser === undefined) {
    messagePayload.body = `A new [Github Issue](${issueUrl}) has been opened!`
  } else {
    messagePayload.body = `A new [Github Issue](${issueUrl}) has been opened! <at>${msUser.name}</at> you have been assigned to it.`
    messagePayload.mentions = [{
      text: `<at>${msUser.name}</at>`,
      userId: `${msUser.userId}`
    }];
  }
  
  await lib.microsoftteams.messages['@0.0.2'].create(messagePayload);
  
  return result;

};
