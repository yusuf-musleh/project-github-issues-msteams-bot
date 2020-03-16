
function getMsTeamsUserFromGithubUser (githubUser) {
  let githubToMSTeamsMapping = {
    'yusuf-musleh': {
      name: 'Yusuf Musleh',
      userId: '42c92c78-4c29-4700-84a8-239b2178be1c'
    },
    'keithwhor': {
      name: 'Keith Horwood',
      userId: 'ffcd6603-13ef-4acd-bc15-e77109497f72'
    },
    'jacoblee93': {
      name: 'Jacob Lee',
      userId: '93aafb71-004a-4a7d-8dce-5152e4329935'
    }
  }
  
  return githubToMSTeamsMapping[githubUser]
  
}

function groupIssuesByAssignees (issues) {
  let groupedIssues = {};
  
  for (let i = 0; i < issues.length; i++) {
    let assignee = issues[i].assignee ? issues[i].assignee.login : 'Unassigned';
    let msUser = getMsTeamsUserFromGithubUser(assignee);
  
    if (assignee && msUser) {
      if (groupedIssues[msUser.name]) {
        groupedIssues[msUser.name].push({
          issueUrl: issues[i].html_url,
          issueTitle: issues[i].title,
          userId: msUser.userId
        });
      } else {
        groupedIssues[msUser.name] = [{
          issueUrl: issues[i].html_url,
          issueTitle: issues[i].title,
          userId: msUser.userId
        }];
      }
    }
  }
  
  return groupedIssues;
}

module.exports = {
  getMsTeamsUserFromGithubUser,
  groupIssuesByAssignees
};
