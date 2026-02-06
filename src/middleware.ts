export { default } from "next-auth/middleware";

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/patients/:path*",
        "/settings/:path*"
    ]
};
