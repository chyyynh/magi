import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { getProposal } from '@/lib/api/proposalUtils';
import { getGeminiDecision } from '@/lib/api/aiService';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Get the latest user message
  const lastMessage = messages[messages.length - 1];
  const userInput = lastMessage.content;

  // Check if this is a Snapshot proposal request
  const isSnapshotRequest = userInput.includes('snapshot') || userInput.startsWith('0x');

  if (isSnapshotRequest) {
    try {
      // Fetch proposal data
      const proposalResult = await getProposal(userInput);

      if (proposalResult.success && proposalResult.data) {
        const proposal = proposalResult.data;

        // Get AI decision
        const geminiDecisionResult = await getGeminiDecision(proposal);

        // Use AI SDK streamText for proposal analysis
        const result = streamText({
          model: openai('gpt-4o-mini'),
          system: `You are the MAGI System AI assistant. A proposal has been analyzed. Present the results in a structured format.`,
          messages: [
            {
              role: 'user',
              content: `Present this proposal analysis:

**Title:** ${proposal.title}
**Choices:** ${proposal.choices?.join(', ') || 'None'}
**Space:** ${proposal.space?.name || 'Unknown'}
**MAGI Decision:** ${geminiDecisionResult.decision}
**Reasoning:** ${geminiDecisionResult.reason}

Format this as a professional analysis report and mention that the proposal is now loaded into the MAGI system for voting.`
            }
          ],
          temperature: 0.7,
          maxOutputTokens: 1000,
        });

        return result.toTextStreamResponse();
      } else {
        return new Response('Failed to fetch proposal data. Please check the link or ID and try again.', {
          status: 400,
        });
      }
    } catch (error) {
      console.error('Error processing proposal:', error);
      return new Response('Error processing proposal. Please try again.', {
        status: 500,
      });
    }
  }

  // For general chat, use AI SDK streamText
  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: `You are the MAGI System AI assistant, inspired by Evangelion's supercomputers.

Your role is to help users analyze DAO governance proposals from Snapshot. You have a cyberpunk, technical personality but remain helpful and professional.

Key capabilities:
- Analyze Snapshot proposal links or IDs (starting with 0x)
- Provide governance insights and recommendations
- Explain complex DeFi/DAO concepts
- Guide users through the voting process

When users provide Snapshot links or proposal IDs, you will process them through the MAGI analysis system.

Use a technical but accessible tone, occasionally referencing the MAGI system's analytical capabilities.`,
    messages: messages.map((msg: { role: string; content: string }) => ({
      role: msg.role,
      content: msg.content,
    })),
    temperature: 0.7,
    maxOutputTokens: 1000,
  });

  return result.toTextStreamResponse();
}