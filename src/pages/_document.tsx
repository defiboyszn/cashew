import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
        />
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        {/* Primary Meta Tags */}
        <title>
          Cashew by Sendtokens: The Wallet for Finance
        </title>
        <meta
          name="title"
          content="Cashew by Sendtokens: The Wallet for Finance"
        />
        <meta
          name="description"
          content="Cashew by Sendtokens is a secure and user-friendly self-custodial wallet that allows users perform consumer activities while onchain"
        />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.cashew.sendtokens.xyz" />
        <meta
          property="og:title"
          content="Cashew by Sendtokens: The Wallet for Finance"
        />
        <meta
          property="og:description"
          content="Cashew by Sendtokens is a secure and user-friendly self-custodial wallet that allows users perform consumer activities while onchain"
        />
        <meta property="og:image" content="/meta_data.jpeg" />
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.cashew.sendtokens.xyz" />
        <meta
          property="twitter:title"
          content="Cashew by Sendtokens: The Wallet for Finance"
        />
        <meta
          property="twitter:description"
          content="Cashew by Sendtokens is a secure and user-friendly self-custodial wallet that allows users perform consumer activities while onchain"
        />
        <meta property="twitter:image" content="/meta_data.jpeg" />
      </Head>
      <body>
        <Main />
      </body>
      <NextScript />
    </Html>
  );
}
