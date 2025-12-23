import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/services"
import type { User } from "@/types"

// Hook para buscar lista de usuários
export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await api.get<User[]>("/users")
      return response.data
    },
  })
}

// Hook para buscar um usuário específico
export function useUser(id: number) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: async () => {
      const response = await api.get<User>(`/users/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

// Hook para criar usuário
export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      name: string
      email: string
      password: string
    }) => {
      const response = await api.post<User>("/users", data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })
}

// Hook para atualizar usuário
export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<User> }) => {
      const response = await api.put<User>(`/users/${id}`, data)
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      queryClient.invalidateQueries({ queryKey: ["users", variables.id] })
    },
  })
}

// Hook para deletar usuário
export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/users/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })
}
