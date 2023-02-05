import React from "react";
import Link from "next/link";
import style from "./Market.module.css";

const Market = () => {
  //---Market--menu---
  const market = [
    {
      name: "Collection",
      link: "Collection",
    },
    {
      name: "Listed Items ",
      link: "ListedItems",
    },
  ];
  return (
    <div className={style.Market_box}>
      {market.map((e, i) => (
        <div key={i} className={style.market}>
          <Link href={{ pathname: `${e.link}` }}>{e.name}</Link>
        </div>
      ))}
    </div>
  );
};

export default Market;
