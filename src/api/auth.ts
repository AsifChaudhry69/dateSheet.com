// src/api/auth.ts

import { api } from "./axios";

export type RegisterParams = {
  name: string;
  email: string;
  password: string;
};

export type RegisterResponse = {
  success: boolean;
  message: string;

  data: {
    user: {
      id: string;
      name: string;
      email: string;
    };

    token: string;
  } | null;
};

export const registerUser = async (
  payload: RegisterParams,
): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>(
    "/auth/register",
    payload,
  );

  return response.data;
};