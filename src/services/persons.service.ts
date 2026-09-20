import { AppError, mapSupabaseError } from '@/lib/errors'
import { supabase } from '@/services/supabase'
import type { Person, PersonPayload } from '@/types/person'

const localStorageKey = 'vemasmas-admin-persons'

function isLocalFallback(): boolean {
  return !supabase && import.meta.env.DEV
}

function readLocalPersons(): Person[] {
  const stored = window.localStorage.getItem(localStorageKey)
  if (!stored) return []
  try {
    return JSON.parse(stored) as Person[]
  } catch {
    window.localStorage.removeItem(localStorageKey)
    return []
  }
}

function writeLocalPersons(persons: Person[]): void {
  window.localStorage.setItem(localStorageKey, JSON.stringify(persons))
}

function requireBackend(): never {
  throw new AppError('CONFIGURATION', 'Configura Supabase para consultar datos de personas.')
}

function normalizePayload(payload: PersonPayload): PersonPayload {
  return {
    ...payload,
    name: payload.name.trim(),
    email: payload.email.trim().toLowerCase(),
    role: payload.role?.trim() || null,
  }
}

export async function listPersons(): Promise<Person[]> {
  if (isLocalFallback()) return readLocalPersons()
  if (!supabase) requireBackend()
  const { data, error } = await supabase.from('persons').select('*').order('created_at', { ascending: false })
  if (error) throw mapSupabaseError(error)
  return data as Person[]
}

export async function getPerson(id: string): Promise<Person> {
  if (isLocalFallback()) {
    const person = readLocalPersons().find((item) => item.id === id)
    if (!person) throw new AppError('NOT_FOUND', 'No se encontró la persona.')
    return person
  }
  if (!supabase) requireBackend()
  const { data, error } = await supabase.from('persons').select('*').eq('id', id).maybeSingle()
  if (error) throw mapSupabaseError(error)
  if (!data) throw new AppError('NOT_FOUND', 'No se encontró la persona.')
  return data as Person
}

export async function createPerson(input: PersonPayload): Promise<Person> {
  const payload = normalizePayload(input)
  if (isLocalFallback()) {
    const persons = readLocalPersons()
    if (persons.some((person) => person.email === payload.email)) throw new AppError('DUPLICATE', 'El correo ya está registrado.')
    const person: Person = { ...payload, id: crypto.randomUUID(), created_at: new Date().toISOString(), status: payload.status }
    writeLocalPersons([person, ...persons])
    return person
  }
  if (!supabase) requireBackend()
  const { data, error } = await supabase.from('persons').insert(payload).select('*').single()
  if (error) throw mapSupabaseError(error)
  return data as Person
}

export async function updatePerson(id: string, input: PersonPayload): Promise<Person> {
  const payload = normalizePayload(input)
  if (isLocalFallback()) {
    const persons = readLocalPersons()
    const index = persons.findIndex((person) => person.id === id)
    if (index < 0) throw new AppError('NOT_FOUND', 'No se encontró la persona.')
    if (persons.some((person) => person.id !== id && person.email === payload.email)) throw new AppError('DUPLICATE', 'El correo ya está registrado.')
    const current = persons[index]
    if (!current) throw new AppError('NOT_FOUND', 'No se encontró la persona.')
    const updated = { ...current, ...payload }
    persons[index] = updated
    writeLocalPersons(persons)
    return updated
  }
  if (!supabase) requireBackend()
  const { data, error } = await supabase.from('persons').update(payload).eq('id', id).select('*').single()
  if (error) throw mapSupabaseError(error)
  return data as Person
}

export async function deletePerson(id: string): Promise<void> {
  if (isLocalFallback()) {
    const persons = readLocalPersons()
    if (!persons.some((person) => person.id === id)) throw new AppError('NOT_FOUND', 'No se encontró la persona.')
    writeLocalPersons(persons.filter((person) => person.id !== id))
    return
  }
  if (!supabase) requireBackend()
  const { error } = await supabase.from('persons').delete().eq('id', id)
  if (error) throw mapSupabaseError(error)
}
