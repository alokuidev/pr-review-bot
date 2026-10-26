import { inngest } from "../client.js";
import { octokit } from "../lib/github.js";
import { run } from "@openai/agents";
import { githubPRReviewAgent } from "../../agents/github-pr-review.agent.js";
/**
 * Event:{
 * data:{
 *  owner: string,
 * repo: string,
 * pull_number: number,
 * }
 * }
 */
export const githubReview = inngest.createFunction(
  {
    id: "github-review",
    triggers: [
      {
        event: "github/pullrequest.review",
      },
    ],
  },
  async ({ event, step }) => {
    const { owner, repo, pull_number } = event.data;
    const pullRequestInfo = await step.run(
      "fetch-pull-request-information",
      async () => {
        const { data } = await octokit.pulls.get({
          owner,
          repo,
          pull_number,
        });

        return {
          id: data.id,
          title: data.title,
          state: data.state,
          number: data.number,
          comments_url: data.comments_url,
          url: data.url,
          diff_url: data.diff_url,
          changes: data.changed_files,
          commits: data.commits,
        };
      },
    );

    if (pullRequestInfo.state !== "open") {
      return {
        message: "Pull request is not open, no review needed",
        skipped: true,
        completed: false,
      };
    }
    const changes = await step.run("fetch-changes", async () => {
      const changesResult = await octokit.paginate(octokit.pulls.listFiles, {
        owner,
        repo,
        pull_number,
        per_page: 100,
      });
      return changesResult.map((change) => ({
        filename: change.filename,
        status: change.status,
        changes: change.changes,
        additions: change.additions,
        deletions: change.deletions,
        patch: change.patch,
        previous_filename: change.previous_filename,
      }));
    });
    if(changes.length === 0) {
      return {
        message: "No changes found in the pull request",
        skipped: true,
        completed: false,
      };
    }
    const review = await step.run("ai-analyze", async () => {
      const llmResponse = await run(
        githubPRReviewAgent,
        `Pull Request Information:
${JSON.stringify(pullRequestInfo, null, 2)}

Changes:
${JSON.stringify(changes, null, 2)}`,
      );

      return llmResponse.finalOutput;
    });

    return {
      message: "Pull request fetched successfully",
      skipped: false,
      completed: true,
      pullRequest: pullRequestInfo,
      changes,
      review,
    };
  },
);
