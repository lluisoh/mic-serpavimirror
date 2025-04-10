export type ResponseBody<T = any> = T & {
  error?: string;
}