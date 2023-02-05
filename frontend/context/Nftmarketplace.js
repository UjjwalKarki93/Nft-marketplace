import React, { useState, useEffect, createContext, useContext } from "react";
import { marketPlaceAddress, nftCollectionsAbi } from "../constants";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

import { logger, utils } from "ethers";

import axios from "axios";
import { getContractByName } from "../components/hooks/useContract";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useAccount, useSigner, useProvider } from "wagmi";

const client = ipfsHttpClient({
  url: "http://ipfs.pylontoken.com:5001/",
});

//-----helper function to extract nft metadata from tokenURI
/**
 * {@returns} metadata object
 * {@argument} token URL which contains metadata in JSON hosted in the IPFS
 */
const extractMetaFromUrl = async (rawURI, ID, price, owner) => {
  try {
    const cleanUri = rawURI.replace("ipfs://", "https://ipfs.io/ipfs/");

    const metadata = await axios.get(cleanUri);

    let _image = metadata.data.image.replace(
      "ipfs://",
      "https://ipfs.io/ipfs/"
    );

    const nftAssets = {
      tokenID: ID,
      owner: owner ?? "0X0000000000000",
      price: price ?? 0,
      rawImg: metadata.data.image,
      name: metadata.data.name,
      description: metadata.data.description,
      image: _image,
    };

    return nftAssets;
  } catch (e) {
    console.error("unable to extract metadata from given url", e.message);
  }
};

export const marketPlaceContext = createContext();

export const useMarketplaceContext = () => {
  return useContext(marketPlaceContext);
};

export const NftMarketPlaceProvider = ({ children }) => {
  //current account address
  const { address } = useAccount();
  const provider = useProvider();
  const { data: signer } = useSigner();
  const router = useRouter();

  //--upload to IPFS function

  const uploadToIpfs = async (file) => {
    try {
      const added = await client.add({ content: file });

      const url = `https://ipfs.io/ipfs/${added.path}`;

      return url;
    } catch (e) {
      console.log("inside uploadtpfs", e);
      alert("Error! uploading to ipfs");
    }
  };

  //---create Nft function
  const createNft = async (name, image, description) => {
    const contract = getContractByName("marketPlace", signer);
    if (!name ?? !description ?? !image) return alert("Your Data is missing:");
    const metadata = JSON.stringify({ name, description, image });
    console.log("metadata", metadata);
    try {
      const added = await client.add({ content: metadata });
      const url = `https://ipfs.io/ipfs/${added.path}`;
      console.log("metad upploaded url", url);
      await contract.createYourProfile(url);
    } catch (e) {
      console.error(e.message);
    }
  };

  /** ------fetch Nfts function----
   * {@param}type: (listed,owned)
   * {@returns} array of NFT's metadata
   **/

  const fetchNftsFromMarket = async (type) => {
    //bool- false(default): provider
    //bool: true --> provider
    const contract = getContractByName("marketPlace");
    const collection = getContractByName("collections");

    const DataArray =
      type == "listedNfts"
        ? await contract.getListedNfts()
        : await contract.getYourNfts();
    const returnMeta = [];
    tokensArray.map(async (token, index) => {
      if (type == "listedNfts") {
        const { tokenID, owner, seller, price, sold } = DataArray[index];
        const tokenUri = await contract.getTokenUri(tokenID);
        const {
          data: { name, image, description },
        } = await axios.get(tokenUri);
        const metadata = {
          name: name,
          image: image,
          description: description,
          price: price,
          sold: sold,
          owner: owner,
        };
        returnMeta.push(metadata);
      } else {
        const tokenID = parseInt(token, 16);
        const tokenUri = await contract.getTokenUri(tokenID);
        const {
          data: { name, image, description },
        } = await axios.get(tokenUri);
        const metadata = {
          name: name,
          image: image,
          description: description,
          price: price,
        };
        returnMeta.push(metadata);
      }
    });
  };

  //-----fetch nfts owned from collections in your wallet
  const getCollectionNfts = async () => {
    const collectionContract = getContractByName("collections", provider);
    //returns array of tokens held in the form of BigNUmber
    const tokens = await collectionContract.walletOfOwner(`${address}`);
    console.log(`tokens of this account:${address}`, tokens);
    let assetsArray = [];
    for (let i = 0; i < tokens.length; i++) {
      //access element of torkens based on index and convert it in integer to get exact token ID held
      let Id = tokens[i].toString();

      try {
        const rawUri = await collectionContract.tokenURI(Id);
        const cleanUri = rawUri.replace("ipfs://", "https://ipfs.io/ipfs/");

        const metadata = await axios.get(cleanUri);

        let _image = metadata.data.image.replace(
          "ipfs://",
          "https://ipfs.io/ipfs/"
        );
        const nftAssets = {
          tokenID: Id,
          rawImg: metadata.data.image,
          name: metadata.data.name,
          description: metadata.data.description,
          image: _image,
        };

        assetsArray.push(nftAssets);
      } catch (e) {
        alert("Error: Try refreshing page..");
        console.log("Error extracting token URis....");
        console.log(`ERROR: ${e.message}`);
      }
    }
    return assetsArray;
  };

  //------list your owned nft---
  const listForSale = async (ID, price) => {
    if (isNaN(price) && price !== "") return alert("invalid Input");
    console.log("inside list", ID);

    const marketContractP = getContractByName("marketPlace", provider);
    const ptenContract = getContractByName("pten", signer);
    const collectionContract = getContractByName("collections", signer);
    const marketContractS = getContractByName("marketPlace", signer);

    try {
      const fees = await marketContractP.getListingPrice();
      await ptenContract.approve(marketPlaceAddress, fees);
      await collectionContract.setApprovalForAll(marketPlaceAddress, true);
      setTimeout(
        await marketContractS.listForSale(ID, utils.parseUnits(`${price}`)),
        15000
      );
    } catch (e) {
      console.log(e);
      alert("Error in listing..");
    }
  };

  //----get total listed items function for marketPlace

  const getTotalListings = async () => {
    const contract = await getContractByName("marketPlace", provider);
    const collection = await getContractByName("collections", provider);
    const listedTokensToMarket = await collection.walletOfOwner(
      marketPlaceAddress
    );
    const datas = await contract.getTotalListedNfts(listedTokensToMarket);
    console.log("datas", datas);

    let assetsArray = [];

    for (let i = 0; i < datas.length; i++) {
      if (utils.formatEther(datas[i][0]) > 0) {
        let tokenID = datas[i][0].toString();
        console.log("id", tokenID);
        const rawURL = await collection.tokenURI(tokenID);

        const price = utils.formatEther(datas[i][3]);
        const owner = datas[i][1];

        const assest = await extractMetaFromUrl(rawURL, tokenID, price, owner);
        assetsArray.push(assest);
      }
    }

    if (assetsArray.length === 0) {
      router.push("/");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Items are not listed yet!",
      });
    }
    return assetsArray;
  };

  //---get all unminted nfts image url from collections
  const getUnmintedNftsFromCollections = async () => {
    const collection = await getContractByName("collections", provider);
    const mintedNUmber = await collection.totalSupply();

    const totalNftsPlaced = await collection.totalNftsPlaced();
    const fees = utils.formatEther(await collection.fees());

    let mintedTokens = [];
    for (let i = 0; i < mintedNUmber; i++) {
      const token = await collection.tokenByIndex(i);
      mintedTokens.push(String(token));
    }

    const baseuri = await collection.baseURI();
    const cleanUri = baseuri.replace("ipfs://", "https://ipfs.io/ipfs/");

    let assestsArray = [];

    for (let i = 1; i <= totalNftsPlaced; i++) {
      if (!mintedTokens.includes(`${i}`)) {
        const url = `${cleanUri}/${i}.json`;

        const asset = await extractMetaFromUrl(url, i, fees);
        assestsArray.push(asset);
      }
    }

    return assestsArray;
  };

  //-----buy nft from collection
  const buyNftFromCollection = async (tokenID) => {
    try {
      const collection = await getContractByName("collections", signer);
      const fees = utils.formatEther(await collection.fees());
      await collection.mint(tokenID, { value: utils.parseUnits(fees) });
    } catch {
      alert("Error in buying");
    }
  };

  //-----function to cancel sale
  const cancelSale = async (tokenID) => {
    try {
      const contract = await getContractByName("marketPlace", signer);
      await contract.cancelSale(tokenID);
    } catch {
      alert("Can't cancel your listing....");
    }
  };

  //----function to buyFromSale
  const buyFromSale = async (tokenID, petnPrice) => {
    try {
      console.log("tokenid", tokenID);
      const contract = await getContractByName("marketPlace", signer);
      const ptenContract = await getContractByName("pten", signer);
      await ptenContract.approve(
        marketPlaceAddress,
        utils.parseUnits(petnPrice)
      );
      setTimeout(await contract.buyNft(tokenID), 15000);
      router.push({ pathname: "/Collection" });
    } catch (e) {
      console.error(e);
      alert("Error in buying process");
    }
  };

  //--returns listed price of a NFT token
  const getListedPrice = async (tokenID) => {
    if (tokenID !== undefined) {
      const contract = await getContractByName("marketPlace", provider);
      const item = await contract.ListedItems(tokenID);

      return utils.formatEther(item.price);
    }
  };

  // getyour listed function
  const getYourLists = async () => {
    try {
      console.log("provider", provider);
      const contract = await getContractByName("marketPlace", signer);
      const collection = await getContractByName("collections", provider);
      const datas = await contract.getYourListings();

      console.log("datas", datas);
      let assets = [];
      for (let i = 0; i < datas.length; i++) {
        let tokenID = datas[i].toString();
        const rawUrl = await collection.tokenURI(tokenID);
        const price = await getListedPrice(tokenID);
        const asset = await extractMetaFromUrl(rawUrl);
        const newAsset = { ...asset, tokenID: tokenID, listedPrice: price };
        assets.push(newAsset);
      }
      console.log("assest :", assets);
      return assets;
    } catch {
      alert("can't extract information of your listed Nfts");
    }
  };

  //----returns raw url of a Nft token
  const getRawUrl = async (tokenID) => {
    if (tokenID !== undefined) {
      console.log("id", tokenID);
      const collection = await getContractByName("collections", provider);
      const url = await collection.tokenURI(tokenID);
      return url;
    }
  };

  const getListedItemOwner = async (tokenID) => {
    if (tokenID !== undefined) {
      const contract = await getContractByName("marketPlace", provider);
      const item = await contract.ListedItems(tokenID);

      return item.owner;
    }
  };

  const getContract = async (name, isSigner = false) => {
    return await getContractByName(`${name}`, isSigner ? signer : provider);
  };

  /**-------render Nfts based on assets passed
  --------optional but will be reusable ---- */

  return (
    <marketPlaceContext.Provider
      value={{
        uploadToIpfs,
        createNft,
        getCollectionNfts,
        listForSale,
        getTotalListings,
        getUnmintedNftsFromCollections,
        buyNftFromCollection,
        buyFromSale,
        cancelSale,
        getYourLists,
        getRawUrl,
        getListedPrice,
        getListedItemOwner,
        extractMetaFromUrl,
        getContract,
      }}
    >
      {children}
    </marketPlaceContext.Provider>
  );
};
