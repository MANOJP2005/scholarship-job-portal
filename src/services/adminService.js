import { supabase, isSupabaseConfigured } from './supabaseClient';

const opportunitiesTable = 'opportunities';
const notificationsTable = 'admin_notifications';

export async function signInAdmin(email, password) {
  if (!isSupabaseConfigured()) {
    return { data: { user: null }, error: new Error('Configure Supabase Auth before signing in as an administrator.') };
  }
  const result = await supabase.auth.signInWithPassword({ email, password });
  if (!result.error && result.data.user?.user_metadata?.role !== 'admin') {
    await supabase.auth.signOut();
    return { data: { user: null }, error: new Error('This account is not authorized as an administrator.') };
  }
  return result;
}

export async function signOutAdmin() {
  if (isSupabaseConfigured()) await supabase.auth.signOut();
}

export async function fetchAdminOpportunities() {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase.from(opportunitiesTable).select('id, payload').order('created_at', { ascending: false });
  if (error) throw error;
  return data.map((row) => ({ ...row.payload, id: row.id }));
}

export async function saveAdminOpportunity(opportunity) {
  if (!isSupabaseConfigured()) return;
  const { error } = await supabase.from(opportunitiesTable).upsert({ id: opportunity.id, payload: opportunity });
  if (error) throw error;
}

export async function removeAdminOpportunity(id) {
  if (!isSupabaseConfigured()) return;
  const { error } = await supabase.from(opportunitiesTable).delete().eq('id', id);
  if (error) throw error;
}

export async function fetchAdminNotifications() {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await supabase.from(notificationsTable).select('id, payload').order('created_at', { ascending: false });
  if (error) throw error;
  return data.map((row) => ({ ...row.payload, id: row.id }));
}

export async function saveAdminNotification(notification) {
  if (!isSupabaseConfigured()) return;
  const { error } = await supabase.from(notificationsTable).upsert({ id: notification.id, payload: notification });
  if (error) throw error;
}

export async function removeAdminNotification(id) {
  if (!isSupabaseConfigured()) return;
  const { error } = await supabase.from(notificationsTable).delete().eq('id', id);
  if (error) throw error;
}
