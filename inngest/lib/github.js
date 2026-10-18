//impor octokit
import "dotenv/config";
import { Octokit } from "@octokit/rest";

export const octokit = new Octokit({
  auth: process.env.OPENAI_API_KEY,
  userAgent: "inngest-github-review-bot",
});