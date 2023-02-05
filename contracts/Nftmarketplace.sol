// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import "hardhat/console.sol";

contract  Nftmarketplace is IERC721Receiver,ReentrancyGuard,ERC721URIStorage {

 using Counters for Counters.Counter;
 Counters.Counter public tokenIDs;
 
 address payable owner;
//equivalent to 1.5 PTEN;
 uint public listingFee = 1500000000000000000 wei;
 

 ERC721Enumerable NFT;
 IERC20 PTEN;


event itemListed(uint indexed tokenID,address indexed owner,address seller,uint price,bool sold);

 struct ListedItem {
//indicates the number of nft token for listing
uint tokenID;
address owner;
address seller;
uint price;
bool sold; 

 }



mapping(address => uint[]) public ListingsByAddress;

 mapping(uint => ListedItem) public ListedItems;
 mapping (address => uint) public users;


constructor(ERC721Enumerable _NFT,IERC20 _PTEN) ERC721("User Token","UT"){
    owner = payable(msg.sender);
    NFT = _NFT;
    PTEN = _PTEN;
    
}

modifier  onlyOwner {
    require(owner == msg.sender,"only owner of the contract is allowed");
    _;
}

function updateListingPrice(uint _price) public onlyOwner{
 listingFee = _price;
}


function getListingPrice() public view returns(uint){
 return listingFee;
}


function listForSale(uint tokenID,uint price) external  nonReentrant {
   require(NFT.ownerOf(tokenID) == msg.sender,"you are not the owner of this token");
   require(ListedItems[tokenID].tokenID == 0,"already listed");
 
  /** account caller ----approve(address(this)) ---> PTEN trasnfer **/

   //transfer PTEN listing fees to the marketplace contract owner
   bytes memory PTENtransferData = abi.encodeWithSignature("transferFrom(address,address,uint256)",msg.sender,owner,listingFee);
   (bool success,) = address(PTEN).call(PTENtransferData);
   require(success,"Erorr occured in listing fees transfer ");

   ListedItems[tokenID] = ListedItem(tokenID,payable(msg.sender),address(this),price,false);

   /** accountCaller ----approveForAll--->adress(this) **/

   
 //transfer NFT from nft owner to the marketplace contract
  NFT.transferFrom(msg.sender,address(this),tokenID);
  ListedItems[tokenID].owner = msg.sender;
  ListedItems[tokenID].seller = address(this);
  



 ListingsByAddress[msg.sender].push(tokenID);



  emit itemListed(tokenID,msg.sender,address(this),price,false);
}
 
 

 function buyNft(uint tokenID) public nonReentrant {
     uint price = ListedItems[tokenID].price;
     /** account caller will approve marketplace contract **/
     require(PTEN.transferFrom(msg.sender,ListedItems[tokenID].owner,price),"unsucess price transfer");
     NFT.transferFrom(address(this),msg.sender,tokenID);
     ListedItems[tokenID].sold=true;
     delete ListedItems[tokenID];

 delete ListingsByAddress[msg.sender];

 }

 function cancelSale(uint tokenID) public nonReentrant{
     require(ListedItems[tokenID].seller == address(this) && ListedItems[tokenID].owner == msg.sender,"you are not the owner of this token.");
     NFT.transferFrom(address(this),msg.sender,tokenID);
     delete ListedItems[tokenID];

 delete ListingsByAddress[msg.sender];

 }


function getTotalListedNfts(uint[] memory listedTokensOwnedByContract) public view returns (ListedItem[] memory){

uint[] memory listedTokens = listedTokensOwnedByContract;
 uint length = listedTokens.length;
 ListedItem[] memory lists = new ListedItem[](length);
 for(uint i=0;i < length;i++){
         uint tokenID = listedTokens[i];
         ListedItem memory extractedItem = ListedItems[tokenID];
        lists[i] = extractedItem;
      
    
 }
 return lists;

}


function getYourListings()public view returns(uint[] memory){
  return ListingsByAddress[msg.sender];
}


function createYourProfile(string memory _tokenURI) external  {
    require(balanceOf(msg.sender) < 1,"you are allowed only once to create profile");
    uint newtokenID = tokenIDs.current();
  _mint(msg.sender,newtokenID);
  _setTokenURI(newtokenID, _tokenURI);
  users[msg.sender] = newtokenID;
  tokenIDs.increment();
  

}

  function onERC721Received(
        address,
        address from,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
      require(from == address(0x0), "Cannot send nfts to Vault directly");
      return IERC721Receiver.onERC721Received.selector;
    }





//nft collections : 0x47951540b89E18377170431b89111a7A36FdbD73
// ierc20: 0x7521d3ff45acd3311e7e559c66e60c38e1410056
// marketplace contrcat = 0x552da649293a133f6f9AC4b5DD9975c1a43D0A54



}


//0x55924b3347161b531cb0c183c1a2A1F20F7d4373


//0x7caD6a50d6E41515670B4CA081A4062711dDa8f6