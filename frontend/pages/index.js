import Head from "next/head";

import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>NFT MarketPlace</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/pten.png" />
      </Head>
    </div>
  );
}
