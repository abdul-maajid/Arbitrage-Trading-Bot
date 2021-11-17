import 'ABIConstants.js';
const ethers = require('ethers');
const BigNumber = ethers.BigNumber;
const {
    Fetcher,
    Token,
    WETH,
    ChainId,
    TradeType,
    Percent,
    Route,
    Trade,
    TokenAmount,
} = require( '@uniswap/sdk' );

const providerURL = 'http://localhost:8545'; 
const provider = new ethers.providers.JsonRpcProvider( providerURL );
const testAccountAddress = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

const ETH_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
const MAX_UINT256 = ethers.constants.MaxUint256;
const ZERO_BN = ethers.constants.Zero;

const Tokens = {
    WETH: WETH[ ChainId.MAINNET ],
    DAI: new Token( ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18 , 'DAI'),
    BAT: new Token( ChainId.MAINNET, '0x2E642b8D59B45a1D8c5aEf716A84FF44ea665914', 18, 'BAT') ,
    MKR : new Token ( ChainId.MAINNET, '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', 18, 'MKR')
};

const wethContract = constructContract(Tokens.WETH.address, IERC20_ABI, privateKey);
const daiContract = constructContract(Tokens.DAI.address, IERC20_ABI, privateKey);
const mkrContract = constructContract(Tokens.MKR.address, IERC20_ABI, privateKey);
const batContract = constructContract(Tokens.BAT.address, IERC20_ABI, privateKey);

const uniswap = constructContract(   //v2 router
    '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    UNISWAP_ABI,
    SUSHISWAP_ABI,               
);
const sushiswap  = constructContract(
    '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F',
    sushiswapABI,
    privateKey,
);

const wallet = getWallet(privateKey);

function getWallet( privateKey ) {
    return new ethers.Wallet( privateKey, provider )
}

const getDeadlineAfter = delta => Math.floor( Date.now() / 1000 ) + ( 60 * Number.parseInt( delta, 10 ));

// to convert a number into hex string
const toHex = n => `0x${ n.toString( 16 ) }`;

async function getTokenBalanceInBN(address, tokenContract) {
	const balance = await tokenContract.balanceOf(address);
	return BigNumber.from(balance);
}

async function getTokenBalance (address, tokenContract) {
	const balance = await tokenContract.balanceOf(address);
	const decimals = await tokenContract.decimals();

	return ethers.utils.formatUnits(balance, decimals);
}

function constructContract(smAddress, smABI, privateKey) {
	const signer = new ethers.Wallet(privateKey);
	return new ethers.contract(
		smAddress,
		smABI,
		signer.connect(provider)
	);
}

async function printAccountBalance(address, privateKey) {

    const balance = await provider.getBalance(address);
    const wethBalance = await getTokenBalance(address, wethContract);
    const daiBalance = await getTokenBalance(address, daiContract);
    const mkrBalance = await getTokenBalance(address, mkrContract);
    const batBalance = await getTokenBalance(address, batContract);

    console.log(`
    	Account balance: ${ethers.utils.formatUnits(balance, 18)} ethers, 
    	${wethBalance} weth, ${daiBalance} DAI, 
    	${mkrBalance} MKR, ${batBalance} BAT
    `);
}

const signer = new ethers.Wallet(privateKey);
const uniswapRouter = new ethers.contract(
		"0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
		UNISWAP_ABI,
		signer.connect( provider )
	)

