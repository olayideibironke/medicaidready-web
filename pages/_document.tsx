import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/branding/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/branding/favicon-192.png" />
        <link rel="apple-touch-icon" href="/branding/apple-touch-icon.png" />
        <meta name="theme-color" content="#042C53" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
