import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import TaxiCashABI from '../abis/TaxiCash.json';
import { Button, TextField, Card, CardContent, Typography, Box, Alert, Dialog, DialogTitle, DialogContent } from '@mui/material';
import '../App.css';

const contractAddress = '0x0D5570E53d609d51b1B4f2cAFe7fA6C4b2345bCC';
const contractABI = TaxiCashABI;

const TaxiCashDapp = () => {
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [networkError, setNetworkError] = useState(null);
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);
  const [feePercentage, setFeePercentage] = useState(null);
  const [rewards, setRewards] = useState(0); // Rewards state
  const [referralCode, setReferralCode] = useState(''); // Referral code state

  const getFeePercentage = useCallback(async () => {
    if (contract) {
      try {
        const fee = await contract.FEE_PERCENTAGE();
        setFeePercentage(fee.toString());
      } catch (error) {
        console.error("Error getting fee percentage:", error);
      }
    }
  }, [contract]);

  useEffect(() => {
    getFeePercentage();
  }, [getFeePercentage]);

  const connectWallet = async (walletType) => {
    let provider;

    switch (walletType) {
      case 'metamask':
        if (typeof window.ethereum !== 'undefined') {
          provider = new ethers.BrowserProvider(window.ethereum);
        } else {
          setNetworkError('MetaMask not detected');
          return;
        }
        break;
      case 'trustwallet':
        if (typeof window.trustwallet !== 'undefined') {
          provider = new ethers.BrowserProvider(window.trustwallet);
        } else {
          setNetworkError('Trust Wallet not detected');
          return;
        }
        break;
      case 'valora':
        setNetworkError('Valora integration not implemented');
        return;
      case 'celowallet':
        if (typeof window.celo !== 'undefined') {
          provider = new ethers.BrowserProvider(window.celo);
        } else {
          setNetworkError('Celo Wallet Extension not detected');
          return;
        }
        break;
      default:
        setNetworkError('Unknown wallet type');
        return;
    }

    try {
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);

      const taxiCashContract = new ethers.Contract(contractAddress, contractABI, signer);
      setContract(taxiCashContract);

      setNetworkError(null);
      setWalletDialogOpen(false);
      await fetchRewards(address); // Fetch rewards for the user
    } catch (error) {
      console.error("An error occurred:", error);
      setNetworkError('Failed to connect wallet');
    }
  };

  const fetchRewards = async (address) => {
    if (!contract) return;
    try {
      const userRewards = await contract.getUserRewards(address);
      setRewards(userRewards.toString());
    } catch (error) {
      console.error("Error fetching rewards:", error);
    }
  };

  const sendPayment = async () => {
    if (!contract) return;
    try {
      const tx = await contract.sendPayment(recipientAddress, {
        value: ethers.parseEther(amount)
      });
      await tx.wait();
      alert('Payment sent successfully!');
      await fetchRewards(account); // Update rewards after payment
    } catch (error) {
      console.error("Error sending payment:", error);
      alert('Error sending payment. Please check the console for details.');
    }
  };

  const handleReferral = async () => {
    if (!contract || !referralCode) return;
    try {
      const tx = await contract.referUser(referralCode);
      await tx.wait();
      alert('Referral code applied successfully!');
      setReferralCode(''); // Clear input
    } catch (error) {
      console.error("Error applying referral code:", error);
      alert('Error applying referral code. Please check the console for details.');
    }
  };

  return (
    <div className="taxi-cash-app">
      <header className="app-header">
        <h1>TaxiCash</h1>
        {account && (
          <p className="account">
            Connected: {account.slice(0, 6)}...{account.slice(-4)}   
            <Button onClick={() => navigator.clipboard.writeText(account)} variant="outlined">Copy</Button>
          </p>
        )}
      </header>
      <main>
        <Card className="main-card">
          <CardContent>
            {networkError && <Alert severity="error" className="network-error">{networkError}</Alert>}
            {feePercentage !== null && (
              <Typography variant="body2" className="fee-info">
                Service Fee: {feePercentage}%
              </Typography>
            )}
            {rewards !== null && (
              <Typography variant="body2" className="rewards-info">
                Your Rewards: {rewards}
              </Typography>
            )}
            {!account ? (
              <Button variant="contained" onClick={() => setWalletDialogOpen(true)} className="connect-button">
                Connect Wallet
              </Button>
            ) : (
              <Box component="form" className="payment-form">
                <TextField
                  label="Recipient Address"
                  variant="outlined"
                  fullWidth
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  className="input-field"
                />
                <TextField
                  label="Amount in CELO"
                  variant="outlined"
                  fullWidth
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-field"
                />
                <Button variant="contained" onClick={sendPayment} fullWidth className="send-button">
                  Send Payment
                </Button>
                <TextField
                  label="Referral Code"
                  variant="outlined"
                  fullWidth
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  className="input-field"
                />
                <Button variant="outlined" onClick={handleReferral} fullWidth className="referral-button">
                  Apply Referral Code
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </main>
      <Dialog open={walletDialogOpen} onClose={() => setWalletDialogOpen(false)}>
        <DialogTitle>Select a Wallet</DialogTitle>
        <DialogContent>
          <Button onClick={() => connectWallet('metamask')} fullWidth className="wallet-button">MetaMask</Button>
          <Button onClick={() => connectWallet('trustwallet')} fullWidth className="wallet-button">Trust Wallet</Button>
          <Button onClick={() => connectWallet('valora')} fullWidth className="wallet-button">Valora</Button>
          <Button onClick={() => connectWallet('celowallet')} fullWidth className="wallet-button">Celo Wallet Extension</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaxiCashDapp;
