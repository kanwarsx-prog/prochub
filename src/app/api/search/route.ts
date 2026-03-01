import { NextRequest, NextResponse } from 'next/server';
import { searchContent } from '@/lib/graph';

export async function GET(req: NextRequest) {
    const q = req.nextUrl.searchParams.get('q') ?? '';
    if (!q.trim()) return NextResponse.json([]);
    const results = await searchContent(q);
    return NextResponse.json(results);
}
