import { createClient } from '@/lib/supabase/server'
import type { AdminRequest, AdminRequestWithProfile } from '@/lib/types'

export async function getMyAdminRequest(): Promise<AdminRequest | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data } = await supabase
    .from('admin_requests')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  return data
}

export async function getPendingRequests(): Promise<AdminRequestWithProfile[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('admin_requests')
    .select('*, profiles(username, display_name, avatar_url)')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function submitAdminRequest(): Promise<AdminRequest> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('admin_requests')
    .insert({ user_id: user.id })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function approveRequest(requestId: string): Promise<void> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  // Get the request to find the user_id
  const { data: request, error: fetchError } = await supabase
    .from('admin_requests')
    .select('user_id')
    .eq('id', requestId)
    .single()

  if (fetchError || !request) throw new Error('Request not found')

  // Update request status
  const { error: updateError } = await supabase
    .from('admin_requests')
    .update({
      status: 'approved',
      resolved_at: new Date().toISOString(),
      resolved_by: user.id,
    })
    .eq('id', requestId)

  if (updateError) throw updateError

  // Update user role to admin
  const { error: roleError } = await supabase
    .from('profiles')
    .update({ role: 'admin' })
    .eq('id', request.user_id)

  if (roleError) throw roleError
}

export async function rejectRequest(requestId: string): Promise<void> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('admin_requests')
    .update({
      status: 'rejected',
      resolved_at: new Date().toISOString(),
      resolved_by: user.id,
    })
    .eq('id', requestId)

  if (error) throw error
}

export async function demoteUser(userId: string): Promise<void> {
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()

  if (profile?.role === 'super_admin') {
    throw new Error('Cannot demote super admin')
  }

  const { error } = await supabase
    .from('profiles')
    .update({ role: 'regular' })
    .eq('id', userId)

  if (error) throw error
}
