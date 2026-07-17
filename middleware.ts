import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  const isAdminRoute = path.startsWith("/admin") || path.startsWith("/api/admin")
  const isProtectedPage = path.startsWith("/checkout") || path.startsWith("/orders")
  const isProtectedApi = path.startsWith("/api/") && 
    (path.startsWith("/api/cart") || path.startsWith("/api/wishlist") || path.startsWith("/api/orders"))

  if (isAdminRoute) {
    if (!user) {
      if (path.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      const url = new URL("/auth/signin", request.url)
      url.searchParams.set("redirect", path)
      return NextResponse.redirect(url)
    }
    const isAdmin = user.email === "admin@frozenthread.com" || user.user_metadata?.isAdmin === true
    if (!isAdmin) {
      if (path.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  if (!user && (isProtectedPage || isProtectedApi)) {
    if (path.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const url = new URL("/auth/signin", request.url)
    url.searchParams.set("redirect", path)
    return NextResponse.redirect(url)
  }

  if (user && (path.startsWith("/auth/signin") || path.startsWith("/auth/register"))) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
