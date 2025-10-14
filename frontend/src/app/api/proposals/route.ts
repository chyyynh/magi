import { NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq, desc } from 'drizzle-orm';
import { proposals } from '@/lib/db/schema';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const daoId = searchParams.get('daoId');

    if (!daoId) {
      return NextResponse.json({ error: 'daoId is required' }, { status: 400 });
    }

    // Fetch proposals for the DAO from database
    const proposalsList = await db
      .select({
        id: proposals.id,
        title: proposals.title,
        description: proposals.description,
        status: proposals.status,
        voteCount: proposals.voteCount,
        createdAt: proposals.createdAt,
      })
      .from(proposals)
      .where(eq(proposals.daoId, daoId))
      .orderBy(desc(proposals.createdAt))
      .limit(5);

    return NextResponse.json(proposalsList);
  } catch (error) {
    console.error('Error fetching proposals:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
