import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { googleApiCall } from ".";

@Injectable()
export default class FetchService {
    constructor(
        private configService: ConfigService
    ) { }
    async getGoogleTokens(code: string) {
        const params = {
            code: code,
            client_id: this.configService.get('google.client_id'),
            client_secret: this.configService.get('google.client_secret'),
            redirect_uri: this.configService.get('google.redirect_uri'),
            grant_type: 'authorization_code'
        }
        console.log({params})
        const result = await googleApiCall<{
            access_token: string,
            refresh_token: string
        }>({
            method: 'POST',
            path: "https://oauth2.googleapis.com/token",
            params
        })
        if (result.result) {

        }
        return result
    }
    async getNewGoogleAccessToken(refresh_token: string) {

        const result = await googleApiCall<{
            access_token: string
        }>({
            method: 'POST',
            path: "https://oauth2.googleapis.com/token",
            params: {
                refresh_token,
                client_id: this.configService.get('google.client_id'),
                client_secret: this.configService.get('google.client_secret'),
                // redirect_uri: GOOGLE_REDIRECT_URI,
                grant_type: 'refresh_token'
            }
        })
        return result
    }

    async getUserProfile(auth: string) {

        const result = await googleApiCall<{
            name: string,
            email: string,
            picture: string
        }>({
            method: 'GET',
            path: "https://www.googleapis.com/oauth2/v3/userinfo",
            authToken: auth
        })

        return result
    }
}