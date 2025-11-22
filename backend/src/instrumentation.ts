export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { initializeData } = await import('@/lib/db/seeder/db-initializer');
    await initializeData()
  }
}
