import React, { useEffect, useState } from "react";
import { useMarketplaceContext } from "../context/Nftmarketplace";

import { Card, Grid, Row, Text, Loading } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";

const MyListings = () => {
  const { getYourLists } = useMarketplaceContext();
  const [assets, setAssets] = useState();
  const [loading, setLoading] = useState(false);
  const { address } = useAccount();

  const router = useRouter();

  useEffect(() => {
    async function getListings() {
      setAssets(await getYourLists());
      setLoading(true);
    }
    getListings();
  }, [address]);
  return (
    <div>
      <div>
        {assets !== undefined && loading ? (
          <Grid.Container gap={2} justify="flex-start">
            {assets.map((asset, index) => {
              if (asset !== undefined) {
                return (
                  <Grid xs={6} sm={3} key={index}>
                    <Card
                      isPressable
                      variant="shadow"
                      onPress={() => {
                        router.push({
                          pathname: "/[nftDetails]",
                          query: { nftDetails: asset.tokenID },
                        });
                      }}
                      key={index}
                    >
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
                        <Row wrap="wrap" justify="space-between" align="center">
                          <Text i>ID: {asset.tokenID}</Text>
                          <Text b>{asset.name}</Text>

                          <Text
                            css={{
                              color: "$accents7",
                              fontWeight: "$semibold",
                              fontSize: "$sm",
                            }}
                          >
                            {asset.listedPrice} PETN
                          </Text>
                        </Row>
                      </Card.Footer>
                    </Card>
                  </Grid>
                );
              }
            })}
          </Grid.Container>
        ) : (
          <div
            style={{ width: "100%", marginTop: "30px", textAlign: "center" }}
          >
            <Loading type="points" size="xl" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListings;
