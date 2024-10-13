import { defineMiddleware } from 'astro:middleware';
import { getSession } from 'auth-astro/server'

const notAuthenticatedRoutes = [ '/login', '/register' ];

export const onRequest = defineMiddleware(
  async ({ url, locals, redirect, request }, next) => {
    const session = await getSession(request);
    const user = session?.user;

    const isLoggedIn = !!session;

    // TODO:
    locals.isLoggedIn = isLoggedIn;
    locals.user = null;
    locals.isAdmin = false;

    if (user) {
      // TODO:
      locals.user = {
        email: user.email!,
        name: user.name!,
        // avatar: user.photoURL ?? '',
        // emailVerified: user.emailVerified,
      };

      locals.isAdmin = user.role === "admin"
    }

    // TODO: Eventualmente tenemos que controlar el acceso por roles
    if (!locals.isAdmin && url.pathname.startsWith('/dashboard')) {
      return redirect('/');
    }

    if (isLoggedIn && notAuthenticatedRoutes.includes(url.pathname)) {
      return redirect('/');
    }

    return next();
  }
);
