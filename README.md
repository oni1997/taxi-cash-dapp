# Taxi Cash DApp

## Overview

Taxi Cash is a decentralized application (DApp) built on the Celo blockchain, designed to facilitate seamless taxi payments. Users can send payments to taxi drivers and earn rewards by using referral codes. The DApp incorporates a smart contract that manages transactions, referral codes, and service fees.

## Features

- **Send Payments**: Users can send payments to taxi drivers using their Celo wallet addresses.
- **Service Fee**: A 5% service fee is automatically deducted from each transaction, going to the app owner.
- **Referral System**: Users can apply referral codes to earn rewards.
- **Wallet Connectivity**: Supports multiple wallet integrations including MetaMask, Trust Wallet, and Celo Wallet.
- **Rewards Tracking**: Users can track their rewards earned through transactions and referrals.

## Technologies Used

- **Solidity**: For smart contract development.
- **React**: For building the front-end user interface.
- **Ethers.js**: For interacting with the Ethereum blockchain.
- **Material-UI**: For responsive design and UI components.
- **Celo Blockchain**: The underlying blockchain network.

## Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:oni1997/taxi-cash-dapp.git
   cd taxi-cash
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Deploy the smart contract to the Celo blockchain:
   - Use tools like [Remix](https://remix.ethereum.org/) or [Truffle](https://www.trufflesuite.com/truffle) to deploy the `TaxiCash` smart contract.
   - Update the `contractAddress` in `TaxiCashDapp.js` with the deployed contract address.

4. Run the application:
   ```bash
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`.

## Live Demo

You can find the live application at [taxi-cash-dapp.vercel.app](https://taxi-cash-dapp.vercel.app).

## Usage

- **Connect Wallet**: Click on the "Connect Wallet" button to connect your Celo wallet.
- **Send Payment**: Enter the recipient's address and the amount in CELO to send a payment.
- **Apply Referral Code**: Enter a valid referral code to earn rewards.
- **Rewards Tracking**: Check your rewards displayed on the main page.

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, please fork the repository and submit a pull request.

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add new feature'`)
5. Push to the branch (`git push origin feature-branch`)
6. Open a pull request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## Contact

For any inquiries or issues, feel free to reach out:

- **Name**: Onesmus
- **Email**: [dzidzaimaenza@gmail.com](mailto:dzidzaimaenza@gmail.com)