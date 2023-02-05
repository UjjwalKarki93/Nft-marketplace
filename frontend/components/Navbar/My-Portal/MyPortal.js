import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import Style from "./Portfolio.module.css";
import { Avatar, Text } from "@nextui-org/react";
import { useAccount, useProvider } from "wagmi";
import { getContractByName } from "../../hooks/useContract";
import Swal from "sweetalert2";
import axios from "axios";

const MyPortal = () => {
  const provider = useProvider();
  const { address } = useAccount();

  const [avatarImg, setAvatarImg] = useState("");
  const [prevAccount, setPrev] = useState();

  const portal = [
    {
      name: "My Wallet NFTs",
      link: "Mynfts",
    },

    {
      name: "My Listings",
      link: "MyListings",
    },
    {
      name: "My Purchase",
      link: "MyPurchase",
    },
    {
      name: "Create Your Avatar",
      link: "CreateAvatar",
    },
  ];
  useEffect(() => {
    if (address) {
      setAvatarImg(null);
      async function getAvatar(account) {
        try {
          const contract = getContractByName("marketPlace", provider);
          const tokenID = await contract.users(account);
          console.log("addres", account, "tokenID", tokenID.toString());
          const url = await contract.tokenURI(tokenID.toString());

          const {
            data: { image },
          } = await axios.get(url);

          setAvatarImg(image);
        } catch {
          if (avatarImg !== undefined) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Please create your avatar",
            });
          }
        }
      }
      getAvatar(address);
    }
  }, [address]);

  return (
    <div>
      <Avatar src={avatarImg} size="xl" />
      {portal.map((e, i) => (
        <p key={i}>
          <Link href={{ pathname: `${e.link}` }} className={Style.profile}>
            {e.name}
          </Link>
        </p>
      ))}
    </div>
  );
};

export default MyPortal;
