import React, { useState, useRef, useMemo } from "react";
import {
  Card,
  Spacer,
  Button,
  Text,
  Input,
  Container,
} from "@nextui-org/react";

//internal imports
import Upload from "../components/uploadNft/Upload";
import { useMarketplaceContext } from "../context/Nftmarketplace";
import Swal from "sweetalert2";

const CreateAvatar = () => {
  const { uploadToIpfs } = useMarketplaceContext();
  const [isClicked, setClicked] = useState(false);
  const [File, setImageFile] = useState();
  const [url, setUrl] = useState();

  const inputRefName = useRef("");
  const inputRefDesc = useRef("");

  const createHandler = async () => {
    const acceptedImageTypes = ["image/jpg", "image/jpeg", "image/png"];

    if (File && acceptedImageTypes.includes(File.type)) {
      const uri = await uploadToIpfs(File);
      console.log("uri insid create handler", uri);
      setUrl(uri);
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Invalid Image Format!",
      });
    }
  };

  return (
    <div>
      <div>
        <Container
          display="flex"
          alignItems="center"
          justify="center"
          css={{ minHeight: "50vh" }}
        >
          <Card css={{ mw: "420px", p: "20px" }}>
            <Text
              size={24}
              weight="bold"
              css={{
                as: "center",
                mb: "20px",
              }}
            >
              AVATAR
            </Text>
            <Input
              id="1"
              aria-label="name"
              clearable
              bordered
              fullWidth
              color="primary"
              labelLeft="Name"
              size="lg"
              ref={inputRefName}
            />
            <Spacer y={1} />
            <Input
              id="2"
              aria-label="desc"
              clearable
              bordered
              fullWidth
              color="primary"
              size="lg"
              labelLeft=" Description"
              ref={inputRefDesc}
            />

            <Spacer y={1} />
            <Input
              id="3"
              aria-label="img"
              type="file"
              clearable
              bordered
              fullWidth
              color="primary"
              size="lg"
              labelLeft=" Image "
              onChange={(e) => {
                setImageFile(e.target.files[0]);
              }}
            />

            <Spacer y={1} />
            {url !== undefined ? (
              <Upload
                imageURL={url}
                inputOBJ={{
                  name: inputRefName.current.value,
                  description: inputRefDesc.current.value,
                }}
              />
            ) : (
              <Button shadow color="secondary" auto onPress={createHandler}>
                Upload Image
              </Button>
            )}
          </Card>
        </Container>
      </div>
    </div>
  );
};

export default CreateAvatar;
