'use strict';

import React, {DOM} from 'react';
import moment from 'moment';
const {
  div,
  span,
  a
} = DOM;

export default function GithubActivityFeed (props) {
  return (
    div({
      children: props.events.map(event => {
        switch(event.type) {
          case 'PushEvent':
            return PushEventActivity(event);
          case 'PullRequestEvent':
            return PullRequestEventActivity(event);
          default:
            return null;
        }
      })
    })
  )
}

function EventActivity (options, ...children) {
  return (
    div({className: `activity ${options.className}`},
      div({className: `octicon ${options.iconClassName}`}),
      div({className: 'content'}, ...children)
    )
  );
}

function PushEventActivity ({repo, payload, created_at}) {
  return (
    EventActivity({className: 'push', iconClassName: 'octicon-git-commit'},
      'pushed ',
      a({
        href: commitsToUrl(repoLink(repo.name), payload),
        target: '_blank'
      }, `${payload.commits.length} commits `),
      'to ',
      a({
        href: repoLink(repo.name),
        target: '_blank'
      }, repo.name),
      span({className: 'since'}, moment(created_at).fromNow())
    )
  );
}

function PullRequestEventActivity ({repo, payload, created_at}) {
  return (
    EventActivity({
        className: `pull-request ${payload.pull_request.merged_at ? 'merged' : payload.pull_request.state}`,
        iconClassName: 'octicon-git-pull-request'
      },
      `${payload.pull_request.merged_at ? 'merged' : payload.action} a `,
      a({
        href: pullRequestUrl(repoLink(repo.name), payload.number)
      }, 'pull request '),
      'on ',
      a({
        href: repoLink(repo.name),
        target: '_blank'
      }, repo.name),
      span({className: 'since'}, moment(created_at).fromNow())
    )
  );
}

const octiconMap = {
  commit: 'octicon-git-commit',
  pull_request: 'octicon-git-pull-request'
};
const repoLink = name => `https://github.com/${name}`;
const commitUrl = (repoUrl, sha) => `${repoUrl}/commits/${sha}`;
const commitRangeUrl = (repoUrl, tail, head) => `${repoUrl}/compare/${tail}...${head}`;
const pullRequestUrl = (repoUrl, number) => `${repoUrl}/pull/${number}`;

const commitsToUrl = (repoUrl, {commits, before, head}) => {
  if (commits.length === 1) {
    return commitUrl(repoUrl, commits[0].sha);
  }
  return commitRangeUrl(repoUrl, before, head);
}
