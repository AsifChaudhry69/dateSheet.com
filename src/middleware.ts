import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(request) {

    return null;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        
        if (req.nextUrl.pathname === "/admin") {
          return token?.role === "admin";
        }
        
        if (req.nextUrl.pathname === "/dashboard") {
          return !!token;
        }
        return true;
      },
    },
    pages: {
      signIn: "/sign-in",
    },
  },
);

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
