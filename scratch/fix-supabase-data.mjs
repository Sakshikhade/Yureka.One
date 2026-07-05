import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://rvqtlvgaqlgylipsaktm.supabase.co'
const SERVICE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2cXRsdmdhcWxneWxpcHNha3RtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDg2NTk2OCwiZXhwIjoyMDkwNDQxOTY4fQ.pkcfThwmQxHj3rYBMCirQdPuIUJrT7QAXq-zlN9DJKU'

const sb = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function fix(label, fn) {
  process.stdout.write(`${label}... `)
  const result = await fn()
  if (result.error) console.log(`ERROR: ${result.error.message}`)
  else console.log(`OK (${result.count ?? '?'} rows)`)
  return result
}

console.log('\n=== Yureka Data Quality Fix ===\n')

// 1a. elite_rating = 0 but rating > 0 → copy rating value
const { data: eliteZero } = await sb.from('cards').select('id, rating').eq('elite_rating', 0).gt('rating', 0)
console.log(`Step 1a: elite_rating=0 but rating>0 → ${eliteZero?.length ?? 0} cards`)
let n = 0
for (const c of eliteZero ?? []) {
  const { error } = await sb.from('cards').update({ elite_rating: c.rating }).eq('id', c.id)
  if (!error) n++
}
console.log(`         ${n} updated`)

// 1b. Any remaining elite_rating = 0 → 4.5
await fix('Step 1b: remaining elite_rating=0 → 4.5',
  () => sb.from('cards').update({ elite_rating: 4.5 }, { count: 'exact' }).eq('elite_rating', 0))

// 2. rating = 0 → 4.5
await fix('Step 2:  rating=0 → 4.5',
  () => sb.from('cards').update({ rating: 4.5 }, { count: 'exact' }).eq('rating', 0))

// 3. annual_fee null → ₹0
await fix('Step 3:  annual_fee=null → ₹0',
  () => sb.from('cards').update({ annual_fee: '₹0' }, { count: 'exact' }).is('annual_fee', null))

// 4. annual_fee "" → ₹0
await fix('Step 4:  annual_fee="" → ₹0',
  () => sb.from('cards').update({ annual_fee: '₹0' }, { count: 'exact' }).eq('annual_fee', ''))

// 5. projected_savings garbage text → null
await fix('Step 5:  garbage projected_savings → null',
  () => sb.from('cards').update({ projected_savings: null }, { count: 'exact' })
    .in('projected_savings', ['Not specified','N/A','n/a','NA','-','TBD','Varies','Variable']))

// 6. projected_savings "" → null
await fix('Step 6:  projected_savings="" → null',
  () => sb.from('cards').update({ projected_savings: null }, { count: 'exact' }).eq('projected_savings', ''))

// 7. Strip trailing ? from annual_fee
const { data: qCards } = await sb.from('cards').select('id, annual_fee').like('annual_fee', '%?')
console.log(`Step 7:  trailing "?" in annual_fee → ${qCards?.length ?? 0} cards`)
n = 0
for (const c of qCards ?? []) {
  const { error } = await sb.from('cards').update({ annual_fee: c.annual_fee.replace(/\?/g,'').trim() }).eq('id', c.id)
  if (!error) n++
}
console.log(`         ${n} updated`)

// 8. Strip leading ₹ from annual_fee
const { data: rupeeCards } = await sb.from('cards').select('id, annual_fee').like('annual_fee', '₹%')
console.log(`Step 8:  leading ₹ in annual_fee → ${rupeeCards?.length ?? 0} cards`)
n = 0
for (const c of rupeeCards ?? []) {
  const { error } = await sb.from('cards').update({ annual_fee: c.annual_fee.replace(/^₹\s*/,'').trim() }).eq('id', c.id)
  if (!error) n++
}
console.log(`         ${n} updated`)

// 9. Strip leading Rs. from annual_fee
const { data: rsCards } = await sb.from('cards').select('id, annual_fee').ilike('annual_fee', 'rs.%')
console.log(`Step 9:  leading "Rs." in annual_fee → ${rsCards?.length ?? 0} cards`)
n = 0
for (const c of rsCards ?? []) {
  const { error } = await sb.from('cards').update({ annual_fee: c.annual_fee.replace(/^Rs\.\s*/i,'').trim() }).eq('id', c.id)
  if (!error) n++
}
console.log(`         ${n} updated`)

// Verify
console.log('\n=== Verification ===')
const checks = await Promise.all([
  sb.from('cards').select('*',{count:'exact',head:true}).eq('status','published').eq('elite_rating',0),
  sb.from('cards').select('*',{count:'exact',head:true}).eq('status','published').eq('rating',0),
  sb.from('cards').select('*',{count:'exact',head:true}).eq('status','published').is('annual_fee',null),
])
console.log(`elite_rating=0 remaining : ${checks[0].count} (want 0)`)
console.log(`rating=0 remaining       : ${checks[1].count} (want 0)`)
console.log(`annual_fee=null remaining: ${checks[2].count} (want 0)`)

const { data: sample } = await sb.from('cards').select('name,annual_fee,rating,elite_rating,projected_savings')
  .eq('status','published').order('name').limit(8)
console.log('\nSample after fix:')
sample?.forEach(c => console.log(
  `  ${c.name.padEnd(35)} fee="${(c.annual_fee??'null').slice(0,15).padEnd(15)}" r=${c.rating} er=${c.elite_rating} sv="${(c.projected_savings??'—').slice(0,20)}"`
))
console.log('\n✓ Complete\n')
