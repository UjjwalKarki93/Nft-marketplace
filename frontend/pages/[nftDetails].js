import React, { useEffect, useState } from "react";
import { utils } from "ethers";
import style from "../styles/details.module.css";
import { useRouter } from "next/router";
import { useMarketplaceContext } from "../context/Nftmarketplace";
import { FcLike } from "react-icons/fc";
import { GrList } from "react-icons/gr";
import { marketPlaceAddress } from "../constants";
import { ListedLogs } from "../components/logs/ListedLogs";
import {
  Card,
  Grid,
  Row,
  Text,
  Loading,
  Container,
  Button,
  Collapse,
  Table,
  pink,
} from "@nextui-org/react";
import Swal from "sweetalert2";
import { useAccount } from "wagmi";

const nftDetails = () => {
  const router = useRouter();
  const { address } = useAccount();
  const {
    extractMetaFromUrl,
    getRawUrl,
    getListedPrice,
    getListedItemOwner,
    buyFromSale,
    cancelSale,
  } = useMarketplaceContext();

  const { query } = router;
  const tokenID = query.nftDetails;

  const [price, setPrice] = useState();
  const [owner, setOwner] = useState();
  const [assets, setAssets] = useState();
  const [loading, setLoading] = useState(false);

  const getAssets = async (ID) => {
    const rawUri = await getRawUrl(ID);
    const assests = await extractMetaFromUrl(rawUri);
    const amount = await getListedPrice(ID);
    const lister = await getListedItemOwner(ID);

    setAssets(assests);
    setPrice(amount);
    setOwner(lister);
    setLoading(true);
  };

  useEffect(() => {
    getAssets(tokenID);
  }, [tokenID]);

  return (
    <div className={style.container}>
      {assets !== undefined && loading ? (
        <div>
          <Container css={{ marginTop: "1rem" }} key={1}>
            <Card css={{ height: "40rem" }} key={2}>
              <Card.Divider />
              <Card.Body css={{ p: "$10" }}>
                <Grid.Container
                  gap={2}
                  css={{ top: "$1" }}
                  justify="flex-start"
                >
                  <Grid xs={5} key={3}>
                    <Card
                      isHoverable
                      css={{ height: "30rem", width: "max-content" }}
                      key={2}
                    >
                      <Card.Body css={{ p: 0 }}>
                        <Card.Image
                          src={assets.image}
                          objectFit="cover"
                          width="100%"
                          height="100%"
                        />
                        <Card.Footer>
                          <Row
                            wrap="wrap"
                            justify="space-between"
                            align="center"
                          >
                            <FcLike />
                            <Text
                              css={{
                                color: "$accents7",
                                fontWeight: "$semibold",
                                fontSize: "$sm",
                              }}
                            >
                              {price} PETN
                            </Text>
                          </Row>
                        </Card.Footer>
                      </Card.Body>
                    </Card>
                  </Grid>

                  <Grid xs={7} key={4}>
                    <Container css={{ backgroundColor: "WhiteSmoke" }} key={1}>
                      <Collapse.Group>
                        <br />
                        <Text b>{assets.name}</Text>

                        <Collapse title="Description">
                          <Text>{assets.description}</Text>
                        </Collapse>
                        <Collapse title="Details">
                          <Row
                            wrap="wrap"
                            justify="space-between"
                            align="center"
                          >
                            <Text>Lister</Text>
                            <Text color="green">{owner}</Text>
                          </Row>
                          <Row
                            wrap="wrap"
                            justify="space-between"
                            align="center"
                          >
                            <Text>Token ID</Text>
                            <Text>{tokenID}</Text>
                          </Row>
                          <Row
                            wrap="wrap"
                            justify="space-between"
                            align="center"
                          >
                            <Text>Standrad</Text>
                            <Text i>ERC-721</Text>
                          </Row>
                          <Row
                            wrap="wrap"
                            justify="space-between"
                            align="center"
                          >
                            <Text>Chain</Text>
                            <Text i>BSC Testnet</Text>
                          </Row>
                          <Row
                            wrap="wrap"
                            justify="space-between"
                            align="center"
                          >
                            <Text>Seller</Text>
                            <Text i color="blue">
                              {marketPlaceAddress}
                            </Text>
                          </Row>
                        </Collapse>
                      </Collapse.Group>

                      <ListedLogs tokenID={tokenID} owner={owner} />
                    </Container>
                  </Grid>
                </Grid.Container>
              </Card.Body>
              <Card.Divider />
              <Card.Footer>
                <Row>
                  {owner !== address ? (
                    <Button
                      size="sm"
                      shadow
                      color="success"
                      onPress={async () => {
                        await buyFromSale(tokenID, price);
                        setTimeout(() => {
                          Swal.fire({
                            title: "<strong>SUCCESSFUL<u>Buy</u></strong>",
                            icon: "success",
                            html:
                              "You can view thisin your wallet" +
                              '<Link href="/Mynfts">View</Link> ',

                            showCloseButton: true,
                            showCancelButton: true,
                            focusConfirm: false,
                            confirmButtonText:
                              '<i class="fa fa-thumbs-up"></i> Great!',
                            confirmButtonAriaLabel: "Thumbs up, great!",
                            cancelButtonText:
                              '<i class="fa fa-thumbs-down"></i>',
                            cancelButtonAriaLabel: "Thumbs down",
                          });
                        }, 5000);
                      }}
                    >
                      Buy
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      shadow
                      color="error"
                      onPress={async () => {
                        await cancelSale(tokenID);
                      }}
                    >
                      Cancel Sale
                    </Button>
                  )}
                </Row>
              </Card.Footer>
            </Card>
          </Container>
        </div>
      ) : (
        <div style={{ width: "100%", marginTop: "30px", textAlign: "center" }}>
          <Loading type="points" size="xl" />
        </div>
      )}
    </div>
  );
};

export default nftDetails;
