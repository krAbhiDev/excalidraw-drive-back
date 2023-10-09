export default () => ({
    port: parseInt(process.env.PORT||'3000', 10) ,
    
    google: {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    },
    jwt_secret: process.env.JWT_SECRET
}); 