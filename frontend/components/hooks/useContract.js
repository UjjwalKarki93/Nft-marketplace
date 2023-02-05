import {
  nftCollectionsAbi,
  nftCollectionsAddress,
  marketPlaceAbi,
  marketPlaceAddress,
  ptenAddress,
} from "../../constants";

import { ethers, Contract } from "ethers";

export const getContractByName = (name, signerOrprovider) => {
  const contractDatasByName = {
    marketPlace: {
      abi: marketPlaceAbi,
      address: marketPlaceAddress,
    },

    collections: {
      abi: nftCollectionsAbi,
      address: nftCollectionsAddress,
    },

    pten: {
      abi: [
        "function transferFrom(address sender, address recipient, uint256 amount) external returns (bool)",
        "function approve(address spender, uint256 amount) external returns (bool)",
        "function allowance(address _owner, address spender) external view returns (uint256)",
      ],
      address: ptenAddress,
    },
  };

  try {
    const contract = new Contract(
      `${contractDatasByName[name].address}`,
      contractDatasByName[name].abi,
      signerOrprovider
    );

    return contract;
  } catch (e) {
    console.log("unable to create contract instance", e);
  }
};
