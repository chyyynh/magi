import { streamText, UIMessage, convertToModelMessages, gateway } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, proposalContext }: { messages: UIMessage[]; proposalContext?: string } = await req.json();

  console.log('Chat API received:', {
    messageCount: messages.length,
    hasProposalContext: !!proposalContext,
    contextPreview: proposalContext ? proposalContext.substring(0, 100) + '...' : 'None'
  });

  // Convert messages and add context if available
  let modelMessages = convertToModelMessages(messages);

  // If we have proposal context, add it as the first system message
  if (proposalContext) {
    modelMessages = [
      { role: "system", content: proposalContext },
      ...modelMessages
    ];
  }

  const result = streamText({
    model: gateway("google/gemini-2.5-flash-lite"),
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
}
