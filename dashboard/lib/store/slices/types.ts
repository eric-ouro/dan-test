export interface FetchableThunkState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
