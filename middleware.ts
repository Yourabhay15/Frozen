import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    authorized: ({ req, token }) => {
      // Allow GET requests to /api/products for all users (authenticated or not)
      if (req.nextUrl.pathname.startsWith("/api/products") && req.method === "GET") {
        console.log("Middleware: Allowing public GET access to /api/products");
        return true;
      }
      // For all other matched routes, require authentication
      console.log("Middleware: Requiring authentication for route:", req.nextUrl.pathname);
      return !!token; // Return true if there's a token (user is authenticated)
    },
  },
})

export const config = {
  matcher: ["/admin/:path*", "/api/products/:path*", "/api/users/:path*", "/api/orders/:path*", "/api/categories/:path*", "/api/discounts/:path*", "/api/reviews/:path*", "/api/wishlist/:path*", "/api/cart/:path*"],
}
