import { Html, Head, Main, NextScript } from 'next/document';
require('newrelic');

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <meta charSet="utf-8" />
      <meta name="description" content="SiamPiwat - Campaign Management Website" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{`Campaign Management Website `}</title>
      <body className="text-blue-oxford dark:text-white-anti-flash">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
