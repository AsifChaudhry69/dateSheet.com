import { Response } from "./share";

export function createResponse<T>(
  status: boolean,
  message: string,
  data: T
): Response<T> {
  return {
    status,
    message,
    data,
  };
}
