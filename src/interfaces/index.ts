
export interface Result<T = any> {
    result?: T
    errorMessage: string
    error?: any
    statusCode: number
}
export interface RequestQuery {
    path?: string;
    method?: "GET" | "POST" | "DELETE" | "PATCH";
    headers?: Record<string, string>;
    params?: Record<string, any>;
    body?: any;
    authToken?: string
    onSuccess?: (res: Response, result: Result) => Promise<Result>
    onFail?: (res: Response, result: Result) => Promise<Result>
}