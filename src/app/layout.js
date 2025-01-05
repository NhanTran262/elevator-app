"use client"
import {ToastContainer} from "react-toastify";

export default function RootLayout({children}) {
    return (
        <html lang="en" suppressHydrationWarning>
        <head>
            <meta charSet="utf-8"/>
        </head>
        <body>
        <ToastContainer/>
        {children}
        </body>
        </html>
    );
}
