import { useMutation } from "@tanstack/react-query"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type SignInPayload = {
  email: string
  password: string
}

export function useSignIn() {
  const router = useRouter()

  return useMutation({
    mutationFn: async (payload: SignInPayload) => {
      const result = await signIn("credentials", {
        email: payload.email,
        password: payload.password,
        redirect: false, 
      })

      if (!result?.ok || result?.error) {
        throw new Error(result?.error || "Sign in failed")
      }

      return result
    },
    onSuccess: () => {
      toast.success("Welcome back!")
      router.push("/dashboard")
      router.refresh() 
    },
    onError: (error: Error) => {
      
      toast.error(error.message)
    },
  })
}