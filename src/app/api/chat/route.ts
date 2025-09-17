import { getProposal } from '@/app/utils/proposalUtils';
import { getGeminiDecision } from '@/app/utils/aiService';
import { createOpenAI } from '@ai-sdk/openai';
import { convertToModelMessages, streamText, UIMessage } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Create OpenAI provider instance configured for OpenRouter
const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  headers: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    'X-Title': 'MAGI Terminal',
  },
});

export async function POST(req: Request) {
  console.log('🚀 API route called!');

  const { messages }: { messages: UIMessage[] } = await req.json();
  console.log('📨 Received messages:', messages.length, 'messages');

  // Get the latest user message
  const lastMessage = messages[messages.length - 1];
  console.log('💬 Last message:', lastMessage);

  // Handle both old and new message formats
  let userInput: string;
  if (lastMessage.parts && Array.isArray(lastMessage.parts)) {
    userInput = lastMessage.parts
      .filter(part => part.type === 'text')
      .map(part => part.text)
      .join('');
  } else if ('content' in lastMessage && typeof lastMessage.content === 'string') {
    // Fallback for old format
    userInput = lastMessage.content as string;
  } else {
    console.error('Invalid message format:', lastMessage);
    return new Response('Invalid message format', { status: 400 });
  }

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

        // Create proposal data JSON
        const proposalDataJson = JSON.stringify({
          proposal: proposal,
          decision: geminiDecisionResult.decision,
          reason: geminiDecisionResult.reason
        });

        console.log('📦 Proposal data to embed:', proposalDataJson);

        // Use AI SDK streamText with OpenRouter for proposal analysis
        const result = streamText({
          model: openrouter('google/gemini-2.5-flash-lite'),
          system: `You are the MAGI System AI assistant. A proposal has been analyzed. Present the results in a structured format.`,
          messages: [
            {
              role: 'user',
              content: `[PROPOSAL_DATA]${proposalDataJson}[/PROPOSAL_DATA]

Present this proposal analysis:

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
          onFinish: (result) => {
            console.log('🤖 AI response finished:', result.text);
          }
        });

        // Return AI SDK UI message stream response
        return result.toUIMessageStreamResponse();
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

  // For general chat, use AI SDK streamText with OpenRouter
  try {
    const result = streamText({
      model: openrouter('google/gemini-2.5-flash-lite'),
      system: `You are the MAGI System AI assistant, inspired by Evangelion's supercomputers.

Your role is to help users analyze DAO governance proposals from Snapshot. You have a cyberpunk, technical personality but remain helpful and professional.

Key capabilities:
- Analyze Snapshot proposal links or IDs (starting with 0x)
- Provide governance insights and recommendations
- Explain complex DeFi/DAO concepts
- Guide users through the voting process

When users provide Snapshot links or proposal IDs, you will process them through the MAGI analysis system.

Use a technical but accessible tone, occasionally referencing the MAGI system's analytical capabilities.`,
      messages: convertToModelMessages(messages),
      temperature: 0.7,
      maxOutputTokens: 1000,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Error in chat route:', error);
    return new Response('Error processing request', { status: 500 });
  }
}