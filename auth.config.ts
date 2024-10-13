// import GitHub from '@auth/core/providers/github';
import { db, eq, User } from 'astro:db';

import { defineConfig } from 'auth-astro';
import Credentials from '@auth/core/providers/credentials';
import bcrypt from 'bcryptjs'
import type { AdapterUser } from '@auth/core/adapters';

export default defineConfig({
  providers: [
    // GitHub({
    //   clientId: import.meta.env.GITHUB_CLIENT_ID,
    //   clientSecret: import.meta.env.GITHUB_CLIENT_SECRET,
    // }),
    Credentials({
      credentials: {
        email: { label: 'Correo', type: 'email' },
        password: { label: 'Contraseña', type: 'password' }
      },
      authorize: async ({ email, password }) => {
        const [ user ] = await db.select().from(User).where(eq(User.email, email as string));
        console.log("desde auth.config: ", { user });

        if (!user) {
          throw new Error('Credenciales incorrectas (username)');
        }

        if (!bcrypt.compareSync(password as string, user.password)) {
          throw new Error('Credenciales incorrectas (password)');
        }

        const { password: _, ...rest } = user

        return rest
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = user
      }
      console.log({ token });
      return token
    },
    session: async ({ session, token }) => {
      session.user = token.user as AdapterUser
      console.log({ session });
      return session
    }
  }
});