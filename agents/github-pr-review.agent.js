import { Agent, tool } from "@openai/agents";
import { z } from "zod";    

export const GithubReviewAgentResultSchema = z.object({
    criticalFixes: z.array(z.string()).optional().nullable().describe("A list of critical fixes that need to be made in the pull request."),
    suggestions: z.array(z.string()).optional().nullable().describe("A list of suggestions for improvement in the pull request."),
    content:z.string().describe("The review content in markdown format suitable for posting as a comment on the pull request."),
})
export const githubPRReviewAgent = new Agent({
    name: "github-pr-review-agent",
    outputType: GithubReviewAgentResultSchema,
    instructions: `
        you are an expert AI code reviewer.
        You are given a pull request details with some basic information about the pull request
        and the changes made in the pull request.
        Give a detailed review of the pull request and the changes made in the pull request.
        use emojis to make the review more engaging and fun.
        The review should be in markdown format and should be suitable for posting as a comment on the pull request.
        The review should be constructive and should provide suggestions for improvement.
    `,

});