// import { NextRequest, NextResponse } from "next/server";

// export function middleware(req: NextRequest) {
//   const isAdmin = req.cookies.get("adminToken");
//   const token = req.cookies.get("token")?.value;

//   // console.log("Admin Token:", isAdmin);
//   // console.log("User Token:", token);

//   if (req.nextUrl.pathname.startsWith("/admin") && !isAdmin) {
//     return NextResponse.redirect(new URL("/auth/login", req.url));
//   }

//   // Protected routes
//   const protectedPaths = ['/chat', '/profile', '/favourite']
  
//   // Check if the current path is protected
//   const isProtectedPath = protectedPaths.some(path => 
//     req.nextUrl.pathname.startsWith(path)
//   )

//   if (isProtectedPath && !token) {
//     return NextResponse.redirect(new URL('/', req.url))
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/admin/:path*", "/chat/:path*", "/profile/:path*", "/favourite/:path*"],
// };
