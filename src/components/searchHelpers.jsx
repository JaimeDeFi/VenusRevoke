import Web3 from 'web3';
import { toChecksumAddress, friendlyNumberFormat } from './Utils';
import emptyTokenImage from '../assets/empty-token.svg';

const symbolABI = [{ constant: true, inputs: [], name: "symbol", outputs: [{ name: "", type: "string" }], payable: false, stateMutability: "view", type: "function" }];

const networkConfigs = {
  1: {  // Ethereum
    apiUrl: (address) => `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&apikey=I11NTC7UVEDFBMKP97R56UUB1AUC2PQSHP`,
    rpcUrl: 'https://eth.meowrpc.com',
    blockchainName: 'ethereum'
  },
  56: {  // BNB Chain
    apiUrl: (address) => `https://api.bscscan.com/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&apikey=J5HERDUSE8HWU7HISSURZY1349VBWHX31F`,
    rpcUrl: 'https://bsc.meowrpc.com',
    blockchainName: 'smartchain'
  },
  42161: {  // Arbitrum One
    apiUrl: (address) => `https://api.arbiscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&apikey=GEES8H1WGQPRG9WNGAYEVRCK7FJ6Z7CPQN`,
    rpcUrl: 'https://arbitrum.meowrpc.com',
    blockchainName: 'arbitrum'
  },
  204: {  // opBNB
    apiUrl: (address) => `https://api-opbnb.bscscan.com/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&apikey=11SQ31PRDHUF2TZZCW4AUZ6EUMUVFKZD6R`,
    rpcUrl: 'https://opbnb-mainnet-rpc.bnbchain.org',
    blockchainName: 'opbnb'
  }
};

export async function scanAddress(accountAddress, chainId) {
  const transactions = [];
  const targetMethodId = "0x095ea7b3";

  const networkConfig = networkConfigs[Number(chainId)] || networkConfigs[56];
  const apiUrl = networkConfig.apiUrl(accountAddress);

  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();

  data.result.forEach(tx => {
    if (tx.input.toLowerCase().startsWith(targetMethodId)) {
      transactions.push({
        blockNumber: tx.blockNumber,
        token: tx.to.toLowerCase(),
        spender: '0x' + tx.input.slice(34, 74).toLowerCase(),
        txid: tx.hash,
        timeStamp: tx.timeStamp,
        allowance: tx.input.slice(-64),
      });
    }
  });

  transactions.sort((a, b) => a.blockNumber - b.blockNumber);

  const transactionsMap = {};
  transactions.forEach(transaction => {
    const key = transaction.spender + ";" + transaction.token;
    transactionsMap[key] = transaction;
  });

  return Object.values(transactionsMap)
    .filter(tx => Number(tx.allowance, 16) !== 0)
    .sort((a, b) => a.blockNumber - b.blockNumber);
}

async function getTokenDetails(tokenAddress, chainId) {
  const networkConfig = networkConfigs[Number(chainId)] || networkConfigs[56];
  const blockchainName = networkConfig.blockchainName;

  const infoURL = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${blockchainName}/assets/${tokenAddress}/info.json`;
  const iconURL = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${blockchainName}/assets/${tokenAddress}/logo.png`;
  let iconToUse = emptyTokenImage;

  try {
    const response = await fetch(infoURL);
    if (!response.ok) throw new Error('Failed to fetch token info');
    const tokenInfo = await response.json();

    const iconResponse = await fetch(iconURL);
    if (iconResponse.ok) {
      iconToUse = iconURL;
    }

    return {
      symbol: tokenInfo.symbol,
      icon: iconToUse
    };
  } catch (error) {
    const web3 = new Web3(new Web3.providers.HttpProvider(networkConfig.rpcUrl));
    const tokenContract = new web3.eth.Contract(symbolABI, tokenAddress);
    const symbol = await tokenContract.methods.symbol().call().catch(() => 'Null');

    return {
      symbol: symbol,
      icon: iconToUse
    };
  }
}

export async function transformDataForCard(txData, chainId) {
  const checksumAddress = toChecksumAddress(txData.token);
  const tokenDetails = await getTokenDetails(checksumAddress, Number(chainId));
  let allowanceValue = Number.parseInt(txData.allowance, 16) / 1e18;

  return {
    token: {
      name: tokenDetails.symbol,
      icon: tokenDetails.icon,
      address: checksumAddress,
    },
    spender: toChecksumAddress(txData.spender),
    date: new Date(parseInt(txData.timeStamp, 10) * 1000).toISOString().split('.')[0].replace('T', ' ').substr(2, 14),
    txid: toChecksumAddress(txData.txid),
    allowance: txData.allowance === 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
      ? 'Unlimited'
      : allowanceValue < 0.01
        ? '< 0.01'
        : friendlyNumberFormat(allowanceValue)
  };
}