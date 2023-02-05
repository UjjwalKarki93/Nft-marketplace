import React, { useEffect, useState } from "react";
import { useAccount, useProvider, useSigner, useContract } from "wagmi";
import { marketPlaceAddress, marketPlaceAbi } from "../../constants";
import { Table, Loading } from "@nextui-org/react";
import { utils } from "ethers";

export const ListedLogs = ({ tokenID }) => {
  const provider = useProvider();
  const contract = useContract({
    address: marketPlaceAddress,
    abi: marketPlaceAbi,
    signerOrProvider: provider,
  });

  const [log, setLog] = useState();
  const [loading, setLoading] = useState(false);

  //   console.log("tokenid", tokenID);
  //   const value = BigNumber.from(tokenID);
  //   console.log("value", value);
  //   const block = 5000;
  //   const toBlock = "0x" + block.toString(16);
  //   const filteredLogs = {
  //     fromBlock: 0,
  //     toBlock: toBlock,
  //     address: marketPlaceAddress,
  //     topics: [
  //       ethers.utils.id("itemListed(uint256,address,address,uint256,bool)"),
  //       ethers.utils.hexZeroPad(value, 32),
  //     ],
  //   };

  const filteredLogs = contract.filters.itemListed(
    `${tokenID}`,
    null,
    null,
    null,
    null
  );

  useEffect(() => {
    async function call() {
      const latestBlock = provider.getBlockNumber();
      // 26911267 - block number where contratc was cretaed
      const logs = await contract.queryFilter(filteredLogs, 26911267, 26911478);
      console.log("logs", logs);
      setLog(logs);
      setLoading(!loading);
    }
    call();
  }, []);

  return (
    <div>
      {log != undefined && loading ? (
        <div>
          {log.map((item, i) => (
            <Table
              aria-label="Listing LOgs"
              css={{
                height: "auto",
                minWidth: "100%",
                backgroundColor: "SkyBlue",
              }}
              selectionMode="single"
            >
              <Table.Header>
                <Table.Column>Owner</Table.Column>
                <Table.Column>Price</Table.Column>
              </Table.Header>
              <Table.Body>
                <Table.Row key={i}>
                  <Table.Cell>{item.args.owner}</Table.Cell>
                  <Table.Cell>
                    {utils.formatEther(item.args.price)}&nbsp;PETN
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          ))}
        </div>
      ) : (
        <div style={{ width: "100%", marginTop: "30px", textAlign: "center" }}>
          <Loading type="points" size="xl" />
        </div>
      )}
    </div>
  );
};
