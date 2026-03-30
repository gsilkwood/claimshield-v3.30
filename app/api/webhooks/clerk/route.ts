import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400,
    })
  }

  const eventType = evt.type

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, phone_numbers } = evt.data

    const primaryEmail = email_addresses.find((e) => e.id === evt.data.primary_email_address_id)?.email_address || email_addresses[0]?.email_address
    const primaryPhone = phone_numbers?.find((p) => p.id === evt.data.primary_phone_number_id)?.phone_number || phone_numbers?.[0]?.phone_number || null
    const name = [first_name, last_name].filter(Boolean).join(' ') || null

    if (!primaryEmail) {
      return new Response('No primary email found', { status: 400 })
    }

    try {
      // Upsert user into database
      await db.insert(users).values({
        clerkId: id,
        email: primaryEmail,
        name,
        phone: primaryPhone,
      }).onConflictDoUpdate({
        target: users.clerkId,
        set: {
          email: primaryEmail,
          name,
          phone: primaryPhone,
          updatedAt: new Date(),
        }
      })
    } catch (error) {
      console.error('Error saving user to database:', error)
      return new Response('Error saving user', { status: 500 })
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data
    if (id) {
      try {
        await db.delete(users).where(eq(users.clerkId, id))
      } catch (error) {
        console.error('Error deleting user from database:', error)
        return new Response('Error deleting user', { status: 500 })
      }
    }
  }

  return new Response('', { status: 200 })
}
