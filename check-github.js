import "dotenv/config";
import { Octokit } from "@octokit/rest";

const octokit = new Octokit({ auth: process.env.GITHUB_PAT });

try {
  const { data: user } = await octokit.users.getAuthenticated();
  console.log(`Token valid; authenticated as ${user.login}`);

  const { data: pr } = await octokit.pulls.get({
    owner: "alokuidev",
    repo: "newPortfolio",
    pull_number: 1,
  });

  console.log(`Repo access OK; PR #${pr.number}: ${pr.title} (${pr.state})`);
} catch (error) {
  console.error(`GitHub check failed (${error.status ?? "unknown"}): ${error.message}`);
  process.exitCode = 1;
}