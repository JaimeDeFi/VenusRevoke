import Web3 from 'web3';
import { toChecksumAddress, friendlyNumberFormat } from './Utils';
import emptyTokenImage from '../assets/empty-token.svg';

const symbolABI = [{ constant: true, inputs: [], name: "symbol", outputs: [{ name: "", type: "string" }], payable: false, stateMutability: "view", type: "function" }];
const web3 = new Web3(new Web3.providers.HttpProvider('https://bsc.meowrpc.com/')); // https://bsc-dataseed.binance.org/

export async function scanAddress(accountAddress) {
  const transactions = [];
  const targetMethodId = "0x095ea7b3";
  const apiUrl = `https://api.bscscan.com/api?module=account&action=txlist&address=${accountAddress}&startblock=0&endblock=99999999&apikey=J5HERDUSE8HWU7HISSURZY1349VBWHX31F`;

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

async function getTokenDetails(tokenAddress) {
  const infoURL = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/${tokenAddress}/info.json`;
  const iconURL = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/${tokenAddress}/logo.png`;
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
    const tokenContract = new web3.eth.Contract(symbolABI, tokenAddress);
    const symbol = await tokenContract.methods.symbol().call().catch(() => 'Null');

    return {
      symbol: symbol,
      icon: iconToUse
    };
  }
}

export async function transformDataForCard(txData) {
  const checksumAddress = toChecksumAddress(txData.token);
  const tokenDetails = await getTokenDetails(checksumAddress);
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