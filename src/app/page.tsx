import Hero from '@/components/Hero/Hero';
import MyApps from '@/components/MyApps/MyApps';
import { getTools } from '@/lib/graph';

export const revalidate = 900;

export default async function HomePage() {
  const tools = await getTools();

  return (
    <div>
      <Hero />

      {/* Main content — clean, minimal */}
      <div style={{ padding: '32px 48px' }}>
        <MyApps allTools={tools} />
      </div>
    </div>
  );
}
