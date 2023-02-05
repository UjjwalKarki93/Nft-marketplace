// SPDX-License-Identifier: MIT
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

pragma solidity ^0.8.10;

contract Collection is ERC721Enumerable, Ownable {

    
    using Strings for uint256;
    string public baseURI;
    string public baseExtension = ".json";
    uint256 public maxSupply = 100000;
    uint256 public maxMintAmount = 5;
    bool public paused = false;
    uint public fees = 10000000000000000 ;
    uint public totalNftsPlaced;

    constructor() ERC721("PYLON NFT Collection", "P2N") {
        totalNftsPlaced = 40;
        baseURI="ipfs://QmYB5uWZqfunBq7yWnamTqoXWBAHiQoirNLmuxMzDThHhi/";
    }

    
     function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }
    
    function mint(uint256 _mintAmount) public payable {
        require(msg.value >= _mintAmount*fees,"less amount sent");
            uint256 supply = totalSupply();
            
            require(!paused);
            require(_mintAmount > 0);
            require(_mintAmount <= maxMintAmount);
            require(supply + _mintAmount <= maxSupply);
            
            for (uint256 i = 1; i <= _mintAmount; i++) {
                _safeMint(msg.sender, supply + i);
            }
    }


        function walletOfOwner(address _owner)
        public
        view
        returns (uint256[] memory)
        {
            uint256 ownerTokenCount = balanceOf(_owner);
            uint256[] memory tokenIds = new uint256[](ownerTokenCount);
            for (uint256 i; i < ownerTokenCount; i++) {
                tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
            }
            return tokenIds;
        }
    
        
        function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory) {
            require(
                _exists(tokenId),
                "ERC721Metadata: URI query for nonexistent token"
                );
                
                string memory currentBaseURI = _baseURI();
                return
                bytes(currentBaseURI).length > 0 
                ? string(abi.encodePacked(currentBaseURI, tokenId.toString(), baseExtension))
                : "";
        }
        // only owner
        
        function setmaxMintAmount(uint256 _newmaxMintAmount) public onlyOwner() {
            maxMintAmount = _newmaxMintAmount;
        }
        
        function setBaseURI(string memory _newBaseURI,uint nftQuantity) public onlyOwner() {
            require(totalSupply() == totalNftsPlaced,"previous collection minting is still incomplete");
            baseURI = _newBaseURI;
            totalNftsPlaced += nftQuantity;

        }
        
        function setBaseExtension(string memory _newBaseExtension) public onlyOwner() {
            baseExtension = _newBaseExtension;
        }
        
        function pause(bool _state) public onlyOwner() {
            paused = _state;
        }

        function updateFees(uint newFees)public onlyOwner(){
fees = newFees;
        }
        
        function withdraw() public payable onlyOwner() {
            require(payable(msg.sender).send(address(this).balance));
        }
}