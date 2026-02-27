/**
 * Error helpers for API and runtime errors.
 */

export type ApiErrorLike = {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
};

export const getErrorMessage = (error: unknown, fallback = "Unexpected error"): string => {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message || fallback;

  const maybeApiError = error as ApiErrorLike | null;
  const apiMessage = maybeApiError?.response?.data?.message;
  if (apiMessage) return apiMessage;

  if (maybeApiError?.message) return maybeApiError.message;

  return fallback;
};
