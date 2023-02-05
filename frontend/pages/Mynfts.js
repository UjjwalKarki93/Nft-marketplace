import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";

import {
  Card,
  Button,
  Input,
  Spacer,
  Loading,
  Text,
  Grid,
  Row,
} from "@nextui-org/react";

import { useMarketplaceContext } from "../context/Nftmarketplace";

import Style from "../styles/mynfts.module.css";
import Swal from "sweetalert2";

const Mynfts = () => {
  const { getCollectionNfts, listForSale } = useMarketplaceContext();

  const { address } = useAccount();

  //reference for input
  const inputRef = useRef(null);

  //states
  const [nftAssets, setAssets] = useState(null);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState();

  const getAssets = async () => {
    try {
      const assestsArray = await getCollectionNfts();

      setAssets(assestsArray);
      setLoading(true);
    } catch {
      alert("unbale to get assests data");
    }
  };
  useEffect(() => {
    getAssets();
  }, [address]);

  return (
    <div style={{ backgroundColor: "palegreen", paddingTop: "5px" }}>
      <Text
        size={40}
        css={{
          textGradient: "45deg, $blue600 -20%, $pink600 50%",
          marginBottom: "$30",
          textAlign: "center",
        }}
        weight="bold"
      >
        Your Wallet
      </Text>
      {nftAssets !== undefined && loading ? (
        <Grid.Container gap={7} justify="flex-start">
          {nftAssets.map((e, index) => (
            <Grid key={index}>
              <Card key={index} css={{ mw: "250px" }} isHoverable>
                <Card.Image src={e.image} alt={e.name} />

                <Card.Body>
                  <Row wrap="wrap" justify="space-between" align="center">
                    <Text size={25} weight="bold">
                      ID
                    </Text>
                    <Text color="green" weight="bold">
                      {e.tokenID}
                    </Text>
                  </Row>

                  <Input
                    clearable
                    size="lg"
                    type="number"
                    step="any"
                    shadow={true}
                    placeholder="Price"
                    status="primary"
                    aria-label="Set Price"
                    ref={inputRef}
                    onBlur={() => {
                      setPrice(inputRef.current.value);
                    }}
                    css={{
                      marginRight: "100px",
                      maxWidth: "98 px",
                      backgroundColor: "Green",
                    }}
                  />

                  <Spacer y={1} />
                  <Button
                    size="md"
                    shadow="true"
                    onPress={async () => {
                      try {
                        console.log(price);
                        console.log("tokenID", e.tokenID);
                        await listForSale(e.tokenID, price);
                        setTimeout(() => {
                          Swal.fire({
                            title:
                              "<strong>SUCCESSFUL!  <u>Listing</u></strong>",
                            icon: "success",
                            html: <Link href="/ListedItems">View</Link>,

                            showCloseButton: true,
                            showCancelButton: true,
                            focusConfirm: false,
                            confirmButtonText:
                              '<i class="fa fa-thumbs-up"></i> Great!',
                            confirmButtonAriaLabel: "Thumbs up, great!",
                          });
                        }, 5000);
                      } catch {
                        console.log("unable to list");
                      }
                    }}
                  >
                    List
                  </Button>
                </Card.Body>
                <Card.Divider />
              </Card>
            </Grid>
          ))}

          <br />
        </Grid.Container>
      ) : (
        <div className={Style.Loader_box}>
          <Loading type="points" size="xl" />
        </div>
      )}
    </div>
  );
};

export default Mynfts;
