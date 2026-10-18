//impor octokit
import "dotenv/config";
import { Octokit } from "@octokit/rest";

export const octokit = new Octokit({
  auth: process.env.GITHUB_PAT,
  userAgent: "inngest-github-review-bot",
});