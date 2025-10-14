import { handleScheduled } from './scheduled';
import { createDb } from './db';

export default {
  /**
   * HTTP request handler
   */
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const db = createDb(env.DATABASE_URL);

      // Health check endpoint
      if (url.pathname === '/health') {
        return new Response(
          JSON.stringify({ status: 'ok', timestamp: Date.now() }),
          {
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          }
        );
      }

      // Manual trigger endpoint for testing (remove in production)
      if (url.pathname === '/trigger-governance') {
        // Manually trigger governance collection
        await handleScheduled(
          { cron: '0 * * * *' } as ScheduledEvent,
          env
        );
        return new Response(
          JSON.stringify({ message: 'Governance collection triggered' }),
          {
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          }
        );
      }

      // Default response
      return new Response(
        JSON.stringify({
          message: 'DAO Data Collector Worker',
          endpoints: {
            health: '/health',
            triggerGovernance: '/trigger-governance (dev only)',
          },
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    } catch (error) {
      console.error('Error:', error);
      return new Response(
        JSON.stringify({
          error: 'Internal server error',
          message: error instanceof Error ? error.message : 'Unknown error',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }
  },

  /**
   * Scheduled event handler (cron jobs)
   */
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    await handleScheduled(event, env);
  },
} satisfies ExportedHandler<Env>;
