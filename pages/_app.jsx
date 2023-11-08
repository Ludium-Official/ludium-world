import Head from "next/head";

export default function App({ Component, pageProps }) {
  return <>
    <Head>
      <title>루디움</title>
      <link rel="shortcut icon" href="/favicon.ico" />
    </Head>
    <Component {...pageProps} />
  </>;
}