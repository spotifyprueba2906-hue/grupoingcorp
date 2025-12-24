// =============================================
// SUPABASE EDGE FUNCTION: notify-telegram
// =============================================
// 
// Instrucciones para crear esta Edge Function en Supabase:
//
// 1. Ve a tu proyecto en Supabase Dashboard
// 2. En el menú lateral, haz clic en "Edge Functions"
// 3. Haz clic en "Create a new function"
// 4. Nombre: notify-telegram
// 5. Copia el código de abajo
//
// VARIABLES DE ENTORNO (configúralas en Supabase):
// - TELEGRAM_BOT_TOKEN: 8363632931:AAGzyaPRFXYJpikG-3EZncbzqwyOGNKm2Yw
// - TELEGRAM_CHAT_IDS: 7582558177 (separar con comas si hay más)
//
// =============================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { name, email, phone, message } = await req.json()

        const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN')
        const chatIds = Deno.env.get('TELEGRAM_CHAT_IDS')?.split(',') || []

        if (!botToken || chatIds.length === 0) {
            throw new Error('Telegram configuration missing')
        }

        // Formatear mensaje
        const telegramMessage = `
🔔 *Nuevo Mensaje de Contacto*

👤 *Nombre:* ${name}
📧 *Email:* ${email}
📱 *Teléfono:* ${phone || 'No proporcionado'}

💬 *Mensaje:*
${message}

---
_Recibido desde grupoingcorp.vercel.app_
    `.trim()

        // Enviar a todos los chat IDs
        const sendPromises = chatIds.map(async (chatId) => {
            const response = await fetch(
                `https://api.telegram.org/bot${botToken}/sendMessage`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: chatId.trim(),
                        text: telegramMessage,
                        parse_mode: 'Markdown'
                    })
                }
            )
            return response.json()
        })

        await Promise.all(sendPromises)

        return new Response(
            JSON.stringify({ success: true }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        console.error('Error:', error.message)
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        )
    }
})
