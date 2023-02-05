import "../styles/globals.css";

//internal import
import { Navbar } from "../components";
import { NftMarketPlaceProvider } from "../context/Nftmarketplace";

import { bscTestnet, goerli } from "wagmi/chains";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createClient, WagmiConfig } from "wagmi";

import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from "@web3modal/ethereum";
import { useEffect } from "react";

const chains = [bscTestnet, goerli];
const { provider } = configureChains(chains, [
  walletConnectProvider({ projectId: "42fa53e5c78c2c017400290eb8b7a7ed" }),
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({
    appName: "PTEN Nft Market Place",
    chains,
  }),
  provider,
});

//web3modal client
const ethereumClient = new EthereumClient(wagmiClient, chains);

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <WagmiConfig client={wagmiClient}>
        <NftMarketPlaceProvider>
          <Component {...pageProps} />
        </NftMarketPlaceProvider>
      </WagmiConfig>
      <Web3Modal
        projectId="42fa53e5c78c2c017400290eb8b7a7ed"
        ethereumClient={ethereumClient}
      ></Web3Modal>
    </>
  );
}

export default MyApp;
