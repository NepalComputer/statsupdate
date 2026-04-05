import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: 'buq7hmwv',
  dataset: 'production',
  apiVersion: '2024-04-04', // Use today's date or newer
  useCdn: true, // For faster reads on frontend
})