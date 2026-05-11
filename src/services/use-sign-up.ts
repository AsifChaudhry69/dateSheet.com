import { useMutation } from "@tanstack/react-query";
import { registerUser, RegisterParams, RegisterResponse } from "../api/auth";

export const useRegister = () => {
  return useMutation<RegisterResponse, Error, RegisterParams>({
    mutationFn: (params: RegisterParams) => registerUser(params),
  
  });
};
