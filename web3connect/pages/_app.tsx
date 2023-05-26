import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider, DisclaimerComponent, midnightTheme} from '@rainbow-me/rainbowkit';
import type { AppProps } from 'next/app';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { arbitrum, goerli, mainnet, optimism, polygon } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet,
  rainbowWallet,
  coinbaseWallet,
  walletConnectWallet,
  injectedWallet,
} from '@rainbow-me/rainbowkit/wallets';

const Disclaimer: DisclaimerComponent = ({ Text, Link }) => (
  <Text>
    By connecting your wallet, you agree to the{' '}
    <Link href="https://termsofservice.xyz">Terms of Service</Link> and
    acknowledge you have read and understand the protocol{' '}
    <Link href="https://disclaimer.xyz">Disclaimer</Link>
  </Text>
);


const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [goerli] : []),
  ],
  [publicProvider()]
);
let projectId = 'eb377f8878487f35be77ce714ecebe12';

const connectors = connectorsForWallets([
  {
    groupName: 'select wallet to connect',
    wallets: [
      metaMaskWallet({ projectId, chains }),
      rainbowWallet({ projectId, chains }),
      coinbaseWallet({ chains, appName: 'web3connect' }),
      walletConnectWallet({ projectId, chains }),
      injectedWallet({ chains }),
    ],
  },
]);


// const { connectors } = getDefaultWallets({
//   appName: 'web3connect',
//   projectId: 'eb377f8878487f35be77ce714ecebe12',
//   chains,
// });

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider modalSize="compact" coolMode={true} chains={chains} appInfo={{
        appName: 'web3connect',
        disclaimer: Disclaimer,
      }}
      theme={midnightTheme()}
      >
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
