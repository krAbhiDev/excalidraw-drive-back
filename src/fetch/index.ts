import { RequestQuery, Result } from "../interfaces";
function objectToQueryString(obj: { [key: string]: any }): string {
    const parts: string[] = [];
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            parts.push(`${key}=${value}`);
        }
    }
    return parts.join('&');
}


export async function apiCall<T>(query: RequestQuery) {
    try {
        const { path, method = "GET", headers = {}, params = {}, body, authToken } = query;
        console.log({ path })
        // Construct the URL with query parameters
        let url = path || "";
        // if (Object.keys(params).length > 0) {
        //     const queryParams = new URLSearchParams(params);
        //     url += `?${queryParams.toString()}`;
        // }
        url += "?" + objectToQueryString(params)

        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }
        const requestOptions: RequestInit = {
            method,
            headers: {
                ...headers,
            },
            redirect: 'follow'
        };
        if (body) {
            requestOptions.body = typeof body == 'object' ? JSON.stringify(body) : body
        }
        const response = await fetch(url, requestOptions);
        let result: Result<T> = {
            errorMessage: "",
            statusCode: response.status,
        };
        if (response.ok) {
            if (query.onSuccess) {
                result = await query.onSuccess(response, result)
            }
            else {
                result.result = await response.json()
            }
        } else {
            if (query.onFail) {
                result = await query.onFail(response, result)
            }
            else {
                result = await response.json()
            }
        }
        console.log(result)
        return result;
    } catch (error: any) {
        console.log(error)
        return {
            result: undefined,
            errorMessage: error.message,
            error,
            statusCode: 500,
        }
    }
}
export async function googleApiCall<T>(query: RequestQuery) {
    return apiCall<T>(query)
}