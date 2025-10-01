// Placeholder for cleanup cron job
export default async function handler(req, res) {
  // This can be triggered by Vercel cron or external service
  try {
    // TODO: Delete images older than 30 days from Supabase
    
    res.status(200).json({ success: true, message: 'Cleanup completed' })
  } catch (error) {
    console.error('Error during cleanup:', error)
    res.status(500).json({ success: false, message: 'Cleanup failed' })
  }
}
