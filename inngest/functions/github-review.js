import { inngest } from "../client.js";
export const githubReview = inngest.createFunction({
  id: "github-review",
  triggers: [
    {
      event: "github/pullrequest.review",
    },
  ],
},
async ({ event, step }) => {
  
});
