// middleware.ts
import { clerkMiddleware, createRouteMatcher, AuthObject } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

// Public route'ları belirle
const isPublicRoute = createRouteMatcher(['/login(.*)', '/register(.*)', '/sso-callback(.*)'])

export default clerkMiddleware(async (auth: () => Promise<AuthObject>, req: NextRequest) => {
  const { userId } = await auth()

  // Giriş yapmışsa ve public route'taysa → dashboard'a yönlendir
  if (userId && isPublicRoute(req)) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Giriş yapmamışsa ve private route'taysa → login'e yönlendir
  if (!userId && !isPublicRoute(req)) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Hiçbir yönlendirme yoksa → null dön
  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}