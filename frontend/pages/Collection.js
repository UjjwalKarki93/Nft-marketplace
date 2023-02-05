import React, { useState, useEffect, useRef } from "react";

import { useMarketplaceContext } from "../context/Nftmarketplace";

import {
  Card,
  Grid,
  Row,
  Text,
  Loading,
  Popover,
  Button,
} from "@nextui-org/react";

const Collection = () => {
  const { getUnmintedNftsFromCollections, buyNftFromCollection } =
    useMarketplaceContext();

  const [assets, setAssets] = useState();
  const [loading, setLoading] = useState(false);
  const [isBought, setBought] = useState(false);

  const isBoughtRef = useRef();

  useEffect(() => {
    async function getNfts() {
      setAssets(await getUnmintedNftsFromCollections());
      setLoading(true);
      isBoughtRef.current = false;
    }
    getNfts();
    console.log(
      "prevBrought:",
      isBoughtRef.current,
      "currentIsBrought:",
      isBought
    );
    if (isBought || isBoughtRef.current == isBought) {
      getNfts();
    }
  }, [isBought]);

  return (
    <div>
      {assets !== undefined && loading ? (
        <Grid.Container gap={2} justify="flex-start">
          {assets.map((asset, index) => {
            if (asset !== undefined) {
              return (
                <Popover key={index}>
                  <Grid xs={6} sm={3} key={index}>
                    <Popover.Trigger key={index}>
                      <Card isPressable variant="shadow" key={index}>
                        <Card.Body css={{ p: 0 }}>
                          <Card.Image
                            src={asset.image ?? ""}
                            objectFit="cover"
                            width="100%"
                            height={300}
                            alt={asset.name}
                          ></Card.Image>
                        </Card.Body>
                        <Card.Footer css={{ justifyItems: "flex-start" }}>
                          <Row
                            wrap="wrap"
                            justify="space-between"
                            align="center"
                          >
                            <Text i>ID: {asset.tokenID}</Text>
                            <Text b>{asset.name}</Text>

                            <Text
                              css={{
                                color: "$accents7",
                                fontWeight: "$semibold",
                                fontSize: "$sm",
                              }}
                            >
                              {asset.price} TBNB
                            </Text>
                          </Row>
                        </Card.Footer>
                      </Card>
                    </Popover.Trigger>
                  </Grid>
                  <Popover.Content>
                    <Button
                      shadow
                      color="gradient"
                      onClick={async () => {
                        await buyNftFromCollection(asset.tokenID);
                        setTimeout(() => {
                          setBought(!isBought);
                        }, 9000);
                      }}
                    >
                      Buy
                    </Button>
                  </Popover.Content>
                </Popover>
              );
            }
          })}
        </Grid.Container>
      ) : (
        <div style={{ width: "100%", marginTop: "30px", textAlign: "center" }}>
          <Loading type="points" size="xl" />
        </div>
      )}
    </div>
  );
};

export default Collection;
