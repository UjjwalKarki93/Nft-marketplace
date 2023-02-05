import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import style from "./Navbar.module.css";
import { Text } from "@nextui-org/react";

//internal import
import { Market, MyPortal } from "./index";
import images from "../img";

//import web3modal button
import { Web3Button } from "@web3modal/react";

const Navbar = () => {
  //states for the navbar

  const [menuItem, setItem] = useState({
    market: false,
    portal: false,
    collection: false,
  });

  return (
    <div className={style.navbar}>
      <div className={style.container}>
        {/* start of left section */}
        <div className={style.container_left}>
          <div className={style.logo}>
            <Link href="/">
              <Image
                src={images.logo}
                alt="marketplace"
                width={100}
                height={100}
              />
            </Link>
          </div>
        </div>

        {/* end of left section */}

        <div className={style.container_right}>
          {/* Market component */}
          <div className={style.container_discover}>
            <Text
              size={26}
              css={{
                color: "Black",
              }}
              weight="semibold"
              onClick={(e) => {
                setItem({ market: !menuItem.market });
              }}
              className={style.market}
            >
              Market
            </Text>
            {menuItem.market && (
              <div className={style.discoverBox}>
                <Market className={style.mhover} />
              </div>
            )}
          </div>

          {/* portal component */}
          <div className={style.container_profile}>
            <Text
              size={25}
              css={{
                color: "black",
              }}
              weight="semibold"
              onClick={() => {
                setItem({ portal: !menuItem.portal });
              }}
            >
              Portal
            </Text>

            {menuItem.portal && (
              <div className={style.profileBox}>
                <MyPortal />
              </div>
            )}
          </div>

          {/* web3modal connect button */}
          <div className={style.connect}>
            <Web3Button />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
