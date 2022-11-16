import { useState, useRef, useEffect } from "react";
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import { WHITELIST_CONTRACT_ADDRESS, abi } from "../constants";
export default function Home() {
    const [walletConnected, setWalletConnected] = useState(false);
    const whitelistJoined = useRef(false);
    const joined = useRef(false);
    const [loading, setLoading] = useState(false);
    const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(false);
    const web3modelRef = useRef();

    const getProviderOrSigners = async (needSigner = false) => {
        const provider = await web3modelRef.current.connect();
        const web3Provider = new providers.Web3Provider(provider);

        const { chainId } = await web3Provider.getNetwork();
        if (chainId != 5) {
            windows.alert("Change the Network to Goerli");
            throw new Error("Change Network to Goerli");
        }

        if (needSigner) {
            const signer = web3Provider.getSigner();
            return signer;
        }
        return web3Provider;
    };

    // add Address to list
    const addAddressToWhitelist = async () => {
        try {
            const signer = await getProviderOrSigners(true);

            const whitelistContract = new Contract(WHITELIST_CONTRACT_ADDRESS, abi, signer);
            const tx = await whitelistContract.addAddressToWhitelist();
            setLoading(true);
            await tx.wait();
            setLoading(false);
            await getNumberOfWhitelisted();
            joined.current = true;
        } catch (err) {
            console.error(err);
        }
    };

    // get number of whitelisted

    const getNumberOfWhitelisted = async () => {
        try {
            const provider = await getProviderOrSigners();
            const whitelistContract = new Contract(WHITELIST_CONTRACT_ADDRESS, abi, provider);

            const _numberOfWhitelisted = await whitelistContract.numWhitelistedAddresses();
            setNumberOfWhitelisted(_numberOfWhitelisted);
        } catch (err) {
            console.error(err);
        }
    };
    // check if address is whitelisted

    const checkWhitelisted = async () => {
        try {
            const signer = await getProviderOrSigners();
            const whitelistContract = new Contract(WHITELIST_CONTRACT_ADDRESS, abi, signer);
            const address = await signer.getAddress();
            const _joinedWhitelist = await whitelistContract.whitelistAddresses(address);
            joined.current = _joinedWhitelist;
        } catch (err) {
            console.error(err);
        }
    };

    // connect to wallet

    const connectWallet = async () => {
        try {
            await getProviderOrSigners();
            setWalletConnected(true);
            checkWhitelisted();
            getNumberOfWhitelisted();
        } catch (err) {
            console.error(err);
        }
    };

    const renderButton = () => {
        if (walletConnected) {
            if (joined) {
                return (
                    <div className=" text-white font-medium">Thanks for joining the Whitelist!</div>
                );
            } else if (loading) {
                return <button className="p-10 text-white">Loading...</button>;
            } else {
                return (
                    <button
                        onClick={addAddressToWhitelist}
                        className="px-10 py-5 rounded-md text-[#ffeade] text-2xl font-medium bg-[#3B0040]"
                    >
                        Join the Whitelist
                    </button>
                );
            }
        } else {
            return (
                <button
                    onClick={() => connectWallet()}
                    className="px-10 py-5 rounded-md text-[#ffeade] text-2xl font-medium bg-[#3B0040]"
                >
                    Connect your wallet
                </button>
            );
        }
    };

    useEffect(() => {
        if (!walletConnected) {
            web3modelRef.current = new Web3Modal({
                network: "goerli",
                providerOptions: {},
                disableInjectedProvider: false,
            });
            connectWallet();
        }
    }, [walletConnected]);
    return (
        <div className="w-full h-screen bg-black text-white flex flex-col justify-center  items-center  space-y-10">
            <h1 className=" font-bold text-7xl">NFTLabs</h1>
            <p className="font-medium italic text-3xl">You're not You. You're a Monster!</p>

            {renderButton()}
            <div>{numberOfWhitelisted}</div>
        </div>
    );
}
