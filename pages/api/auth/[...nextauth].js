import NextAuth from "next-auth";
import Providers from "next-auth/providers";

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const options = {
    providers: [
        {
          id: process.env.CLIENT_ID,
          name: process.env.ENV_NAME,
          type: "oauth",
          version: "2.0", 
          scope: 'openid',
          params: { grant_type: 'authorization_code' },
          accessTokenUrl: process.env.ACCESSTOKEN_URL,
          authorizationUrl: process.env.AUTHORIZATION_URL,
          profileUrl: process.env.PROFILE_URL,
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          headers: {
            Authorization: 'Basic ' + Buffer.from((clientId + ':' + clientSecret)).toString('base64')
          },
          profile: (profile) => {
            console.dir(profile)
          //   {  
          //     'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': 'jfeinour',  
          //     'http://identity.ncarb.org/claims/AlpineUserLogin': 'b390dcb2-cad1-4ecd-ac61-aba500ddd9d2',  
          //     'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': 'CertMetricsAdmin,Member Board Only Access,My NCARB Account', 
          //     'http://identity.ncarb.org/claims/grouppermission': 'MemberBoardOnlyAccess,CandidateManagement,TransmittalAccess,DisciplinaryAccess',  
          //     'http://identity.ncarb.org/claims/accountid': '5cadd74d-c40f-4b5b-aafd-aba500ddd9d2',  
          //     'http://identity.ncarb.org/claims/personid': 'b390dcb2-cad1-4ecd-ac61-aba500ddd9d2',  
          //     'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress': 'jfeinour@ncarb.org',  
          //     'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname': 'Joe',  
          //     'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname': 'Feinour',  
          //     'http://identity.ncarb.org/claims/staffId': 'jfeinour@ncarb.org',  
          //     'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': 'jfeinour'
          // }
            return {
              /**
               * {  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': 'jfeinour',  'http://identity.ncarb.org/claims/AlpineUserLogin': 'b390dcb2-cad1-4ecd-ac61-aba500ddd9d2',  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': 'CertMetricsAdmin,Member Board Only Access,My NCARB Account',  'http://identity.ncarb.org/claims/grouppermission': 'MemberBoardOnlyAccess,CandidateManagement,TransmittalAccess,DisciplinaryAccess',  'http://identity.ncarb.org/claims/accountid': '5cadd74d-c40f-4b5b-aafd-aba500ddd9d2',  'http://identity.ncarb.org/claims/personid': 'b390dcb2-cad1-4ecd-ac61-aba500ddd9d2',  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress': 'jfeinour@ncarb.org',  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname': 'Joe',  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname': 'Feinour',  'http://identity.ncarb.org/claims/staffId': 'jfeinour@ncarb.org',  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': 'jfeinour'}
               * 
               */
              name: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
              email: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
              id: profile['http://identity.ncarb.org/claims/personid'],
              sub: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
            }
          },
          
        } 
    ],
    database: process.env.DATABASE_URL,
    callbacks: {
      // async signIn(...args) {
      //   console.dir({args, cb: "signIn"})

      //   return true
      // },
      // async redirect(url, baseUrl) {
      //   console.dir({url, baseUrl, cb: "redirect"})

      //   return baseUrl
      // },
      async session(session, {accessToken} = {}) {
        return {...session, accessToken}
      },
      async jwt(token, user, account, profile, isNewUser) {
        console.dir(token)
        console.dir(account)
        if(account?.accessToken) {
          return {...token, accessToken: account.accessToken}
        }
        return token;
      }
  }
};

export default (req,res) => NextAuth(req, res, options);