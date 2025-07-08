# 🐾 PetVault - Veterinary dApp on Monad Testnet

<h4 align="center">
  <a href="https://docs.scaffoldeth.io">Scaffold-ETH 2 Documentation</a> |
  <a href="https://scaffoldeth.io">Scaffold-ETH Website</a>
</h4>

🏥 A decentralized veterinary application for managing pet health records and consultations on Monad testnet. Built with modern Web3 patterns and comprehensive network detection.

⚙️ Built using NextJS, Wagmi v2, Viem, Foundry, Privy Auth, and TypeScript.

## 🌟 Key Features

- 🔐 **Unified Authentication**: Email + wallet login via Privy
- 🌐 **Network Detection**: Advanced wagmi v2 patterns for chain verification
- 🐾 **Pet NFT Management**: Register and manage digital pet records
- 📱 **Responsive Design**: Mobile-first veterinary interface
- 🔄 **Auto Network Switching**: Seamless Monad testnet enforcement

- ✅ **Contract Hot Reload**: Your frontend auto-adapts to your smart contract as you edit it.
- 🪝 **[Custom hooks](https://docs.scaffoldeth.io/hooks/)**: Collection of React hooks wrapper around [wagmi](https://wagmi.sh/) to simplify interactions with smart contracts with typescript autocompletion.
- 🧱 [**Components**](https://docs.scaffoldeth.io/components/): Collection of common web3 components to quickly build your frontend.
- 🔥 **Burner Wallet & Local Faucet**: Quickly test your application with a burner wallet and local faucet.
- 🔐 **Integration with Wallet Providers**: Connect to different wallet providers and interact with the Ethereum network.

![Debug Contracts tab](https://github.com/scaffold-eth/scaffold-eth-2/assets/55535804/b237af0c-5027-4849-a5c1-2e31495cccb1)

## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v20.18.3)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Environment Variables

Create a `.env.local` file in `packages/nextjs/` with the following variables:

```bash
# 🔐 Privy Auth Configuration (Required)
# Get your app ID from https://dashboard.privy.io/
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here

# 📦 Pinata IPFS Configuration (Required) 
# Get your JWT from https://app.pinata.cloud/
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt_token_here

# 🌐 WalletConnect Configuration (Optional)
# Get your project ID from https://cloud.walletconnect.com/
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here
```

## Quickstart

To get started with PetVault, follow the steps below:

1. **Clone and install dependencies:**

```bash
git clone <repository-url>
cd petvault
yarn install
```

2. **Set up environment variables:**

Create `packages/nextjs/.env.local` with the required environment variables (see above).

3. **Run local development (optional):**

```bash
# Start local blockchain
yarn chain

# Deploy to local network
yarn deploy --network localhost

# Start frontend
yarn start
```

4. **Deploy to Monad Testnet:**

```bash
# Deploy contracts to Monad testnet
yarn deploy --network monad

# Start frontend (configured for Monad testnet)
yarn start
```

Visit your app on: `http://localhost:3000`. 

## 🌐 Network Configuration

This dApp is **specifically configured for Monad Testnet** and includes:

- **Automatic Network Detection**: Uses wagmi v2 patterns for robust chain verification
- **Network Enforcement**: Automatically prompts users to switch to Monad testnet
- **Multi-wallet Support**: Compatible with MetaMask, Rabby, WalletConnect, and more

Run smart contract test with `yarn foundry:test`

- Edit your smart contracts in `packages/foundry/contracts`
- Edit your frontend homepage at `packages/nextjs/app/page.tsx`. For guidance on [routing](https://nextjs.org/docs/app/building-your-application/routing/defining-routes) and configuring [pages/layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts) checkout the Next.js documentation.
- Edit your deployment scripts in `packages/foundry/script`


## Documentation

Visit our [docs](https://docs.scaffoldeth.io) to learn how to start building with Scaffold-ETH 2.

To know more about its features, check out our [website](https://scaffoldeth.io).

## Contributing to Scaffold-ETH 2

We welcome contributions to Scaffold-ETH 2!

Please see [CONTRIBUTING.MD](https://github.com/scaffold-eth/scaffold-eth-2/blob/main/CONTRIBUTING.md) for more information and guidelines for contributing to Scaffold-ETH 2.