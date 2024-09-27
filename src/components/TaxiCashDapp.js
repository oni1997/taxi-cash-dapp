import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import TaxiCashABI from '../abis/TaxiCash.json';
import { Button, TextField, Card, CardContent, Typography, Box, Alert, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { QRCodeCanvas } from 'qrcode.react'; // Use the named export for QRCodeCanvas

const contractAddress = '0x625B60928c1FaE4f779820A889e80586BDD054De'; // Replace with your deployed contract address
const contractABI = TaxiCashABI;

const TaxiCashDapp = () => {
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [networkError, setNetworkError] = useState(null);
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);
  const [feePercentage, setFeePercentage] = useState(null);
  const [qrCodeDialogOpen, setQrCodeDialogOpen] = useState(false);

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

      const ownerAddress = await taxiCashContract.owner();
      setIsOwner(ownerAddress.toLowerCase() === address.toLowerCase());

      setNetworkError(null);
      setWalletDialogOpen(false);
    } catch (error) {
      console.error("An error occurred:", error);
      setNetworkError('Failed to connect wallet');
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
    } catch (error) {
      console.error("Error sending payment:", error);
      alert('Error sending payment. Please check the console for details.');
    }
  };

  const withdrawFees = async () => {
    if (!contract || !isOwner) return;
    try {
      const tx = await contract.withdrawFees();
      await tx.wait();
      alert('Fees withdrawn successfully!');
    } catch (error) {
      console.error("Error withdrawing fees:", error);
      alert('Error withdrawing fees. Please check the console for details.');
    }
  };

  return (
    <div className="taxi-cash-app">
      <header className="app-header">
        <h1>TaxiCash</h1>
        {account && <p className="account">Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>}
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
                <Button variant="outlined" onClick={() => setQrCodeDialogOpen(true)} fullWidth className="qr-button">
                  Generate QR Code
                </Button>
                {isOwner && (
                  <Button variant="outlined" onClick={withdrawFees} fullWidth className="withdraw-button">
                    Withdraw Fees
                  </Button>
                )}
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
      <Dialog open={qrCodeDialogOpen} onClose={() => setQrCodeDialogOpen(false)}>
        <DialogTitle>Scan to Pay</DialogTitle>
        <DialogContent>
          <QRCodeCanvas value={`ethereum:${recipientAddress}?amount=${amount}`} size={256} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaxiCashDapp;
