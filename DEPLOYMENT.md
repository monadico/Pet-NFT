# PetVault Deployment Guide

## Deploy to Vercel

### Prerequisites

Before deploying, you need to set up the following services:

1. **Pinata Account** (for IPFS storage)
   - Sign up at https://pinata.cloud/
   - Create a new API key with full permissions
   - Copy the JWT token

2. **WalletConnect Account** (for wallet connections)
   - Sign up at https://walletconnect.com/
   - Create a new project
   - Copy the Project ID

3. **Privy Account** (for email authentication)
   - Sign up at https://privy.io/
   - Create a new app
   - Copy the App ID

### Step-by-Step Deployment

#### 1. Fork or Clone the Repository

```bash
git clone your-repo-url
cd scaffold-monad-foundry-1
```

#### 2. Install Dependencies

```bash
yarn install
```

#### 3. Build the Application Locally (Optional)

```bash
yarn next:build
```

#### 4. Deploy to Vercel

Option A: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from the nextjs package directory
cd packages/nextjs
vercel

# Follow the prompts to configure your project
```

Option B: Using Vercel Dashboard
1. Go to https://vercel.com/
2. Click "New Project"
3. Import your repository
4. Set the root directory to `packages/nextjs`
5. Configure environment variables (see below)
6. Deploy

#### 5. Configure Environment Variables

In your Vercel project settings, add these environment variables:

```
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt_token_here
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here
```

#### 6. Configure Build & Development Settings

- **Framework Preset**: Next.js
- **Root Directory**: `packages/nextjs`
- **Build Command**: `yarn build`
- **Install Command**: `yarn install`

### Environment Variables Details

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `NEXT_PUBLIC_PINATA_JWT` | JWT token for IPFS uploads | Pinata Dashboard → API Keys |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Project ID for wallet connections | WalletConnect Dashboard |
| `NEXT_PUBLIC_PRIVY_APP_ID` | App ID for email authentication | Privy Dashboard |

### Deployment Verification

After deployment, verify the following:

1. **Homepage loads correctly** with PetVault branding
2. **Connect Account button** opens the authentication modal
3. **Email authentication** works through Privy
4. **Wallet connection** works through WalletConnect
5. **Pet registration** can upload images to IPFS
6. **Modal centering** is fixed and displays properly

### Troubleshooting

**Build Errors:**
- Make sure all environment variables are set
- Check that the build command is `yarn build`
- Verify the root directory is set to `packages/nextjs`

**Runtime Errors:**
- Check browser console for missing environment variables
- Verify all API keys are correctly formatted
- Check that IPFS uploads are working

**Styling Issues:**
- Ensure Tailwind CSS is properly configured
- Check that all Monad brand colors are displaying correctly

### Domain Configuration

Once deployed, you can:
1. Use the default Vercel domain (e.g., `petvault.vercel.app`)
2. Add a custom domain in Vercel settings
3. Configure SSL (automatically handled by Vercel)

### Environment-Specific Configurations

#### Development
```bash
yarn dev
```

#### Production
```bash
yarn build
yarn start
```

### Monitoring

After deployment, monitor:
- Build logs in Vercel dashboard
- Application performance
- IPFS upload success rates
- User authentication flows

### Support

For deployment issues:
1. Check Vercel deployment logs
2. Verify environment variables are set correctly
3. Test locally with `yarn build` and `yarn start`
4. Check browser console for runtime errors

---

🎉 **Congratulations!** Your PetVault veterinary records system is now deployed and ready to help veterinarians manage secure, immutable pet health records on the blockchain. 