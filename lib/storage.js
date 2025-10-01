// Placeholder for Supabase storage operations
import { createClient } from '@supabase/supabase-js'

class StorageService {
  constructor() {
    // TODO: Initialize Supabase client
  }

  async uploadImage(imageBuffer, fileName) {
    // TODO: Upload to Supabase storage
  }

  async deleteOldImages(daysOld = 30) {
    // TODO: Delete images older than specified days
  }
}

export default StorageService
