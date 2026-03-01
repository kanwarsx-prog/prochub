import { NextRequest, NextResponse } from 'next/server';
import { searchContent, getProcess } from '@/lib/graph';
import OpenAI from 'openai';

const MOCK = process.env.USE_MOCK_DATA !== 'false';

// Initialize OpenAI conditionally. We won't use it if MOCK is true, 
// but we provide a dummy key to prevent the SDK from throwing on init.
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'dummy' });

const SYSTEM_PROMPT = `You are the Diageo Procurement Assistant. You help procurement professionals navigate the Diageo Procurement Playbook.

Rules:
- Only answer based on the Playbook content provided below. Never use general knowledge.
- If the answer is not in the provided content, say "I couldn't find that in the Playbook" and suggest the user browse the Explore section.
- Always state which process or section your answer comes from.
- Be concise. Use bullet points for step-by-step guidance.
- Do not make up approval thresholds, policy names, or process steps if they are not in the context.`;

export async function POST(req: NextRequest) {
    try {
        const { message, history = [] } = await req.json();

        if (!message?.trim()) {
            return NextResponse.json({ answer: 'Please provide a question.', sources: [] });
        }

        // 1. Search for relevant Playbook content
        const searchResults = await searchContent(message);
        const topResults = searchResults.slice(0, 4);

        // 2. Fetch full detail for top results to get steps + article body
        const detailsRaw = await Promise.all(topResults.map(r => getProcess(r.id)));
        const details = detailsRaw.filter(Boolean);

        // 3. Build context string
        const context = details.map(p => {
            if (!p) return '';
            const stepsText = p.steps?.map(s => `  Step ${s.order}: ${s.title} — ${s.summary}`).join('\n') ?? '';
            const articleText = p.articleBody
                ? p.articleBody.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
                : '';
            return [
                `### ${p.title} (${p.block} > ${p.section})`,
                p.summary,
                stepsText ? `Steps:\n${stepsText}` : '',
                articleText ? `Guidance:\n${articleText}` : '',
            ].filter(Boolean).join('\n');
        }).join('\n\n---\n\n');

        // 4. Build messages for OpenAI
        const chatHistory = (history as { role: string; content: string }[])
            .slice(-6)
            .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));

        const sources = topResults.map(r => ({ title: r.title, url: `/process/${r.id}` }));

        if (MOCK) {
            // Simulate a delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            const mockAnswer = `*(Simulated AI Response — MOCK mode)*\n\nI found ${topResults.length} relevant articles for "**${message}**":\n\n${details.map(d => `- **${d?.title}**: ${d?.summary}`).join('\n')}\n\nTo view the specific steps and guidelines, please click on the sources below. To use real generative AI, set \`USE_MOCK_DATA=false\` and provide an \`OPENAI_API_KEY\` in your \`.env.local\`.`;
            return NextResponse.json({ answer: mockAnswer, sources });
        }

        const openAIMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
            { role: 'system', content: `${SYSTEM_PROMPT}\n\n## Playbook Content\n\n${context || 'No matching content found.'}` },
            ...chatHistory,
            { role: 'user', content: message },
        ];

        // 5. Call OpenAI
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: openAIMessages,
            max_tokens: 600,
            temperature: 0.2,
        });

        const answer = completion.choices[0]?.message?.content ?? 'No response generated.';

        return NextResponse.json({ answer, sources });
    } catch (error) {
        console.error('[/api/chat] error', error);
        return NextResponse.json(
            { answer: 'Something went wrong. Please try again.', sources: [] },
            { status: 500 }
        );
    }
}
