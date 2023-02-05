require("dotenv").config({ path: ".env" });
async function main() {
  const MarketPlace = await ethers.getContractFactory("Nftmarketplace");
  const deployContract = await MarketPlace.deploy();
  await deployContract.deployed();

  console.log(`deployed to ${deployContract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
