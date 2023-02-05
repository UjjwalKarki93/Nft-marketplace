import React, { useEffect, useState } from "react";
import { useMarketplaceContext } from "../context/Nftmarketplace";
import { useRouter } from "next/router";

import { Card, Grid, Row, Text, Loading } from "@nextui-org/react";
const ListedItems = () => {
  const { getTotalListings } = useMarketplaceContext();
  const router = useRouter();
  const [assets, setAssets] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getListings() {
      setAssets(await getTotalListings());
      setLoading(!loading);
    }
    getListings();
  }, []);

  return (
    <div>
      {assets !== undefined && loading ? (
        <Grid.Container gap={2} justify="flex-start">
          {assets.map((asset, index) => (
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
              >
                <Card.Body css={{ p: 0 }}>
                  <Card.Image
                    src={asset.image}
                    objectFit="cover"
                    width="100%"
                    height={300}
                    alt={asset.name}
                  ></Card.Image>
                </Card.Body>
                <Card.Footer css={{ justifyItems: "flex-start" }}>
                  <Row wrap="wrap" justify="space-between" align="center">
                    <Text b>{asset.name}</Text>
                    <Text
                      css={{
                        color: "$accents7",
                        fontWeight: "$semibold",
                        fontSize: "$sm",
                      }}
                    >
                      {asset.price} PETN
                    </Text>
                  </Row>
                </Card.Footer>
              </Card>
            </Grid>
          ))}
        </Grid.Container>
      ) : (
        <div style={{ width: "100%", marginTop: "30px", textAlign: "center" }}>
          <Loading type="points" size="xl" />
        </div>
      )}
    </div>
  );
};

export default ListedItems;
