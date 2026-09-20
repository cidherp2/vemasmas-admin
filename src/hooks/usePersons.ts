import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createPerson, deletePerson, getPerson, listPersons, updatePerson } from '@/services/persons.service'
import type { PersonPayload } from '@/types/person'

export const personsQueryKey = ['persons'] as const

export function usePersons() {
  const queryClient = useQueryClient()
  const listQuery = useQuery({ queryKey: personsQueryKey, queryFn: listPersons, retry: false })
  const createMutation = useMutation({
    mutationFn: createPerson,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: personsQueryKey }),
  })
  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: PersonPayload }) => updatePerson(id, input),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: personsQueryKey })
      void queryClient.invalidateQueries({ queryKey: [...personsQueryKey, variables.id] })
    },
  })
  const deleteMutation = useMutation({
    mutationFn: deletePerson,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: personsQueryKey }),
  })

  return {
    ...listQuery,
    createPerson: createMutation.mutateAsync,
    updatePerson: updateMutation.mutateAsync,
    deletePerson: deleteMutation.mutateAsync,
    isMutating: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
  }
}

export function usePerson(id: string | undefined) {
  return useQuery({
    queryKey: [...personsQueryKey, id],
    queryFn: () => getPerson(id ?? ''),
    enabled: Boolean(id),
    retry: false,
  })
}
