import React from "react";
import { Button } from "@nextui-org/react";
import Swal from "sweetalert2";

//internal import
import { useMarketplaceContext } from "../../context/Nftmarketplace";
import Link from "next/link";

const Upload = ({ imageURL, inputOBJ }) => {
  // console.log("inside upload js", inputOBJ, url);
  const { createNft } = useMarketplaceContext();

  const create = async () => {
    const { name, description } = inputOBJ;
    console.log("img url inside upload ", imageURL);
    try {
      await createNft(name, imageURL, description);
      await Swal.fire({
        icon: "success",
        title: "Successfully Created Your Avatar",
        footer: <Link href="/">View</Link>,
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "You have already created your Nft",
        footer: <Link href="/">View</Link>,
      });
    }
  };

  return (
    <div>
      <Button shadow color="secondary" auto onPress={create}>
        Create Avatar
      </Button>
    </div>
  );
};

export default Upload;
