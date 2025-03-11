import { GoogleGenerativeAI } from "@google/generative-ai";

export interface Proposal {
  id: string;
  title: string;
  body: string;
  choices: string[];
  start: number;
  end: number;
  state: string;
  author: string;
  space: {
    id: string;
    name: string;
  };
  scores_total: number;
  scores: number[];
  votes: {
    voter: string;
    choice: number;
    vp: number;
  }[];
}

const geminiApiKey: string = process.env.NEXT_PUBLIC_GEMINI_KEY || "";
if (!geminiApiKey) {
  throw new Error("NEXT_PUBLIC_GEMINI_KEY is not defined");
}
const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function getGeminiDecision(proposal: Proposal): Promise<string> {
  console.log("getBalthasar2Decision called");
  try {
    const prompt = `I need you to help me vote on a governance proposal, with the voting options listed in the "choices" field as follows: ${proposal.choices}. The full details of the proposal are as follows: ${proposal.title} ${proposal.body}. Please analyze the proposal based on the following criteria and respond in JSON format:

Analysis criteria:
1. **Objectives and Impact**: Are the proposal’s goals clear? What are its potential impacts on the relevant ecosystem or community?
2. **Resource Allocation**: Is the budget or resource allocation reasonable, transparent, and supported by adequate oversight mechanisms?
3. **Feasibility**: Is the execution plan practical? Does the team have the capability to successfully achieve the goals?
4. **Outcome Assessment**: Are the proposal’s goals or metrics specific, measurable, and aligned with the broader mission?
5. **Risks and Alternatives**: Are there significant risks? Are there better alternative approaches?

Response format (PLS REPSPONSE WITH PURE JSON):
{
  "recommendation": "The chosen voting option from 'choices'",
  "analysis": {
    "objectives_and_impact": "Analysis of objectives and impact",
    "resource_allocation": "Analysis of resource allocation",
    "feasibility": "Analysis of feasibility",
    "outcome_assessment": "Analysis of outcome assessment",
    "risks_and_alternatives": "Analysis of risks and alternatives"
  },
  "reasoning": "Summary reasoning for the recommended option",
  "missing_info": "List any missing information if applicable (empty string if none)"
}

Provide a detailed analysis and recommend a voting option from the "choices" provided (${proposal.choices}). If the proposal lacks sufficient information, note what’s missing in "missing_info" and suggest an appropriate option (e.g., a neutral one if available).
Ensure the response is a pure JSON string that can be directly parsed by JavaScript's JSON.parse, without any additional characters. Provide a detailed analysis and recommend a voting option from the "choices" provided ([insert choices content]). If the proposal lacks sufficient information, note what’s missing in "missing_info" and suggest an appropriate option (e.g., a neutral one if available).`;

    const result = await model.generateContent(prompt);
    let decision = result.response.text().trim(); // 移除首尾空白
    decision = decision
      .replace(/```json/g, "") // 移除開頭的 ```json
      .replace(/```/g, "") // 移除結尾的 ```
      .trim(); // 再次移除可能的空白
    console.log(decision);
    try {
      const parsedDecision = JSON.parse(decision); // 直接解析 JSON
      // console.log("API response:", parsedDecision);
      // console.log("Recommendation:", parsedDecision.recommendation);
      // console.log("Analysis:", parsedDecision.analysis);
      // console.log("Reasoning:", parsedDecision.reasoning);
      // console.log("Missing Info:", parsedDecision.missing_info);
      return `${parsedDecision.recommendation}`;
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return `BALTHASAR·2: Error - ${error.message}`;
    }
  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    return `BALTHASAR·2: Error - ${error.message}`;
  }
}

export async function getCasper3Decision(proposal: Proposal): Promise<string> {
  // TODO: Implement CASPER·3 integration
  return "CASPER·3: Decision pending...";
}

export async function getMelchior1Decision(
  proposal: Proposal
): Promise<string> {
  // TODO: Implement MELCHIOR·1 integration
  return "MELCHIOR·1: Decision pending...";
}
