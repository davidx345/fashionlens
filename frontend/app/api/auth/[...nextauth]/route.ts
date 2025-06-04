import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions, User as NextAuthUser } from "next-auth";
import { createUserFromOAuth } from '@/app/api/services/auth-service';

interface ExtendedUser extends NextAuthUser {
  id: string;
}

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  // session: {
  //   strategy: "jwt",
  // },
  callbacks: {
    async signIn({ user, account, profile }) {
      // console.log("NextAuth signIn callback:", { user, account, profile });
      if (account && account.provider === "google" && profile && profile.email) {
        try {
          // Call your backend service to create or retrieve the user
          const appUser = await createUserFromOAuth(
            profile.email,
            user.name || profile.name || "Unknown User", // Ensure name is provided
            account.provider,
            account.providerAccountId
          );
          // console.log("User signed in/created in app DB:", appUser);

          // Attach your app-specific user ID to the NextAuth user object
          // This ID will then be available in the jwt and session callbacks
          if (appUser && appUser.id) {
            (user as ExtendedUser).id = appUser.id;
          } else {
            console.error("App user ID not found after OAuth sign-in.");
            return false; // Prevent sign-in if app user ID is missing
          }
          return true; // Proceed with sign in
        } catch (error) {
          console.error("Error during OAuth sign-in with custom backend:", error);
          return false; // Prevent sign in if there's an error with your backend
        }
      }      return false; // Deny sign in for other providers or if essential info is missing
    },
    async jwt({ token, user, account }) {
      // console.log("NextAuth JWT callback:", { token, user, account });
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account && user) {
        token.accessToken = account.access_token;
        token.id = (user as ExtendedUser).id || user.id; // user.id from Google, or your app's user.id if set in signIn
      }
      if (user?.email) {
        token.email = user.email;
      }
      if (user?.name) {
        token.name = user.name;
      }
      if (user?.image) {
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      // console.log("NextAuth session callback:", { session, token });
      // Send properties to the client, like an access_token and user id from the token.
      if (session.user) {
        (session.user as ExtendedUser).id = token.id as string;
        // Ensure email, name, and image are passed if available
        if (token.email) session.user.email = token.email as string;
        if (token.name) session.user.name = token.name as string;
        if (token.picture) session.user.image = token.picture as string;

      }
      // session.accessToken = token.accessToken; // If you need to expose the provider's access token
      return session;    },
  },
  // Optional: Add a secret for production environments
  secret: process.env.NEXTAUTH_SECRET,
  // Configure custom pages for proper redirects
  pages: {
    signIn: '/login',
    error: '/login', // Redirect to login on error
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
