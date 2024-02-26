import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-network-helpers");

const main = async () => {
    const USDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";//USDC CONTRACT ADDRESS
    const USDTAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
    const WETHAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"; //WETH HOLDER
    const LIDOAddress = "0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32"; //LIDO

    const UNIRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";   // Throwing error of of UNISWAP router, yet shows balanceOf from the different contracts

    const USDCHolder = "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621";

    await helpers.impersonateAccount(USDCHolder);
    const impersonatedSigner = await ethers.getSigner(USDCHolder);

    const amountOut = ethers.parseUnits("2000", 6);
    const amountInMax = ethers.parseUnits("70", 6);

    const USDC = await ethers.getContractAt("IERC20", USDCAddress);
    const USDT = await ethers.getContractAt("IERC20", USDTAddress);
    const WETH = await ethers.getContractAt("IERC20", WETHAddress);
    const LIDO = await ethers.getContractAt("IERC20", LIDOAddress);

    const ROUTER = await ethers.getContractAt("IUniswap", UNIRouter);

    const approve = await USDT.connect(impersonatedSigner).approve(
        UNIRouter,
        amountInMax
    );
    await approve.wait();

    const ethBal = await impersonatedSigner.provider.getBalance(USDCHolder);

    const usdcBal = await USDC.balanceOf(impersonatedSigner.address);
    const usdtBal = await USDT.balanceOf(impersonatedSigner.address);
    const lidoBal = await LIDO.balanceOf(impersonatedSigner.address);

    console.log("ETH Balance:", ethers.formatUnits(ethBal, 18));
    console.log("USDC Balance:", ethers.formatUnits(usdcBal, 6));
    console.log("USDT Balance:", ethers.formatUnits(usdtBal, 6));
    console.log("LIDO Balance:", ethers.formatUnits(lidoBal, 18));

    const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

    const swapTx = await ROUTER.connect(
        impersonatedSigner
    ).swapTokensForExactTokens(
        amountOut,
        amountInMax,
        [LIDOAddress, USDTAddress],
        impersonatedSigner.address,
        deadline
    );

    await swapTx.wait();

    const usdcBalAfterSwap = await USDC.balanceOf(impersonatedSigner.address);
    const USDTBalAfterSwap = await USDT.balanceOf(impersonatedSigner.address);
    const lidoBalAfterSwap = await LIDO.balanceOf(impersonatedSigner.address);

    const ethBalAfterSwap = await impersonatedSigner.provider.getBalance( USDCHolder);

    

    console.log( "-------------------------Getting Balance----------------------------------------"
    );    

    console.log( "usdc balance after swap", ethers.formatUnits(usdcBalAfterSwap, 6) );
    console.log( "USDT balance after swap", ethers.formatUnits(USDTBalAfterSwap, 6));
    console.log( "eth balance after swap", ethers.formatUnits(ethBalAfterSwap, 18));
    console.log( "lido balance after swap", ethers.formatUnits(lidoBalAfterSwap, 18));

        main().catch((error) => {
            console.error(error);
            process.exitCode = 1;
        });
    }


        main().catch((error) => {
            console.error(error);
            process.exitCode = 1;
        });


        // Throwing error of of UNISWAP router, yet shows balanceOf from the different contracts
        // kept getting EXCESSIVE INPUT AMOUNT.
        // CHANGE IT AND STILL GOT MORE ERRORS. I ADDED LIDO then flegged error at ROUTER ADDRESS