import { useMutation } from "@tanstack/react-query";
import {
  generateDateSheet,
  GenerateDateSheetPayload,
  GenerateDateSheetResponse,
} from "@/src/api/dateSheet";

export function useGenerateDateSheet() {
  return useMutation<
    GenerateDateSheetResponse,
    Error,
    GenerateDateSheetPayload
  >({
    mutationFn: (payload) => generateDateSheet(payload),
  });
}
