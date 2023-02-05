const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect, expectRevert } = require("chai");

const { ethers } = require("hardhat");
const { utils } = require("ethers");

const nftCollectionsAddress = "0xF53605B04a8DcF762dDD191935592962F38EfdA1";
const ptenAddress = "0x7521d3ff45acd3311e7e559c66e60c38e1410056";
const marketPlaceAddress = "0xEBfB28357F0176C4411864dcB2AC4F5Be7214EE2";

describe("Initial Setup", () => {
  let marketPlaceInstance;

  let owner;
  let buyer1;
  let buyer2;
  let buyer3;

  before(async () => {
    marketPlaceInstance = await ethers.getContractAt(
      "Nftmarketplace",
      `${marketPlaceAddress}`
    );

    let [address1, address2, address3, address4] = await ethers.getSigners();
    owner = address1;
    buyer1 = address2;
    buyer2 = address3;
    buyer3 = address4;
  });

  describe("Listing price tests", function () {
    describe("validations", async function () {
      it("contract owner  listing fee: 45 wei ", async function () {
        await marketPlaceInstance
          .connect(owner)
          .updateListingPrice(utils.parseEther("45"));

        expect(
          (await marketPlaceInstance.getListingPrice()).toString()
        ).to.equal("45000000000000000000");
      });

      it("should fail when non-contract owner try to update listing price ", async function () {
        try {
          await marketPlaceInstance
            .connect(buyer1)
            .updateListingPrice(utils.parseEther("85"));
        } catch (e) {
          console.log("error");
          expect(e.message).to.be.include(
            "only owner of the contract is allowed"
          );
        }
      });

      it("listing price after owner updated", async function () {
        const price = await marketPlaceInstance.getListingPrice();

        console.log(`updated listing price: ${price.toString()} wei`);
      });
    });
  });
});
// async function setupTest() {
//   // Contracts are deployed using the first signer/account by default
//   const marketPlaceInstance = await ethers.getContractAt(
//     "Nftmarketplace",
//     `${marketPlaceAddress}`
//   );

//   //create wallet based on mnemonic configured on hardhat
//   // const wallet = await ethers.getWallets();

//   //using the provider that's already connected to BSC testnet via Hardhat.
//   const bscProvider = await ethers.providers;
//   return { marketPlaceInstance };
// }

// describe("contract", function () {
//   it("should return the owner of the marketPlace contract", async function () {
//     const { owner } = await loadFixture(deployMPFixture);
//     console.log(owner.address);
//   });
// });

//     describe("Deployment", function () {
//       it("Should set the right unlockTime", async function () {
//         const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);

//         expect(await lock.unlockTime()).to.equal(unlockTime);
//       });

//       it("Should set the right owner", async function () {
//         const { lock, owner } = await loadFixture(deployOneYearLockFixture);

//         expect(await lock.owner()).to.equal(owner.address);
//       });

//       it("Should receive and store the funds to lock", async function () {
//         const { lock, lockedAmount } = await loadFixture(
//           deployOneYearLockFixture
//         );

//         expect(await ethers.provider.getBalance(lock.address)).to.equal(
//           lockedAmount
//         );
//       });

//       it("Should fail if the unlockTime is not in the future", async function () {
//         // We don't use the fixture here because we want a different deployment
//         const latestTime = await time.latest();
//         const Lock = await ethers.getContractFactory("Lock");
//         await expect(Lock.deploy(latestTime, { value: 1 })).to.be.revertedWith(
//           "Unlock time should be in the future"
//         );
//       });
//     });

//     describe("Withdrawals", function () {
//       describe("Validations", function () {
//         it("Should revert with the right error if called too soon", async function () {
//           const { lock } = await loadFixture(deployOneYearLockFixture);

//           await expect(lock.withdraw()).to.be.revertedWith(
//             "You can't withdraw yet"
//           );
//         });

//         it("Should revert with the right error if called from another account", async function () {
//           const { lock, unlockTime, otherAccount } = await loadFixture(
//             deployOneYearLockFixture
//           );

//           // We can increase the time in Hardhat Network
//           await time.increaseTo(unlockTime);

//           // We use lock.connect() to send a transaction from another account
//           await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
//             "You aren't the owner"
//           );
//         });

//         it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
//           const { lock, unlockTime } = await loadFixture(
//             deployOneYearLockFixture
//           );

//           // Transactions are sent using the first signer by default
//           await time.increaseTo(unlockTime);

//           await expect(lock.withdraw()).not.to.be.reverted;
//         });
//       });

//       describe("Events", function () {
//         it("Should emit an event on withdrawals", async function () {
//           const { lock, unlockTime, lockedAmount } = await loadFixture(
//             deployOneYearLockFixture
//           );

//           await time.increaseTo(unlockTime);

//           await expect(lock.withdraw())
//             .to.emit(lock, "Withdrawal")
//             .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
//         });
//       });

//       describe("Transfers", function () {
//         it("Should transfer the funds to the owner", async function () {
//           const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
//             deployOneYearLockFixture
//           );

//           await time.increaseTo(unlockTime);

//           await expect(lock.withdraw()).to.changeEtherBalances(
//             [owner, lock],
//             [lockedAmount, -lockedAmount]
//           );
//         });
//       });
//     });
//   });
