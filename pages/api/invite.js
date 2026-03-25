// pages/api/invite.js
// ─────────────────────────────────────────────
// GET  ?code=XXX        — validar código (público, al registrarse)
// POST {action:'create'} — crear/obtener enlace genérico del organizador
// POST {action:'redeem', code, userId} — canjear invitación tras registro
// ─────────────────────────────────────────────
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPA_URL,
  process.env.SUPA_SERVICE_KEY  // service_role key — solo en backend
)

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // ── Validar código ──
    const { code } = req.query
    if (!code) return res.status(400).json({ error: 'code requerido' })

    const { data, error } = await sb
      .from('invitations')
      .select('id, code, organizer_id, trial_days, used_by, users!organizer_id(username, club_name, logo_url)')
      .eq('code', code)
      .single()

    if (error || !data) return res.status(404).json({ error: 'Invitación no encontrada' })
    if (data.used_by)   return res.status(410).json({ error: 'Esta invitación ya fue usada' })

    return res.status(200).json({
      valid:       true,
      trial_days:  data.trial_days,
      organizer:   data.users,
      code:        data.code,
    })
  }

  if (req.method === 'POST') {
    const { action, userId, code } = req.body

    // ── Crear o recuperar enlace genérico del organizador ──
    if (action === 'create') {
      if (!userId) return res.status(400).json({ error: 'userId requerido' })

      // Buscar si ya tiene un enlace genérico activo (sin email y sin usar)
      const { data: existing } = await sb
        .from('invitations')
        .select('code')
        .eq('organizer_id', userId)
        .is('email', null)
        .is('used_by', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (existing) return res.status(200).json({ code: existing.code })

      // Crear nuevo
      const { data: created, error } = await sb
        .from('invitations')
        .insert({ organizer_id: userId, email: null, trial_days: 14 })
        .select('code')
        .single()

      if (error) return res.status(500).json({ error: error.message })
      return res.status(201).json({ code: created.code })
    }

    // ── Canjear invitación tras registro ──
    if (action === 'redeem') {
      if (!userId || !code) return res.status(400).json({ error: 'userId y code requeridos' })

      // Buscar invitación
      const { data: inv, error: invErr } = await sb
        .from('invitations')
        .select('id, organizer_id, trial_days, used_by')
        .eq('code', code)
        .single()

      if (invErr || !inv) return res.status(404).json({ error: 'Invitación no encontrada' })
      if (inv.used_by)    return res.status(410).json({ error: 'Invitación ya usada' })

      const trialEnds = new Date()
      trialEnds.setDate(trialEnds.getDate() + inv.trial_days)

      // Actualizar usuario — activar trial y vincular al organizador
      const { error: userErr } = await sb
        .from('users')
        .update({
          trial_ends_at:       trialEnds.toISOString(),
          invited_by:          inv.organizer_id,
          subscription_status: 'trial',
        })
        .eq('id', userId)

      if (userErr) return res.status(500).json({ error: userErr.message })

      // Marcar invitación como usada (solo si es enlace personal — email != null)
      // Los enlaces genéricos se reutilizan
      const { data: invData } = await sb
        .from('invitations')
        .select('email')
        .eq('id', inv.id)
        .single()

      if (invData?.email) {
        await sb.from('invitations')
          .update({ used_by: userId, used_at: new Date().toISOString() })
          .eq('id', inv.id)
      }

      return res.status(200).json({
        ok:         true,
        trial_days: inv.trial_days,
        trial_ends: trialEnds.toISOString(),
      })
    }

    return res.status(400).json({ error: 'action no reconocida' })
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end('Method Not Allowed')
}
