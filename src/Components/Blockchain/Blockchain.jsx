import sha256 from "crypto-js/sha256";
import { useState } from "react";
import s from "./styles.module.css";
import Block from "../Block/Block";

class BlockchainLogic {
  constructor(difficulty = 3) {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = difficulty;
  }

  createGenesisBlock() {
    return {
      index: 0,
      timestamp: Date.now().toString(),
      data: "Genesis Block",
      previousHash: "0",
      nonce: 0,
      hash: this.calculateHash(
        0,
        Date.now().toString(),
        "Genesis Block",
        "0",
        0
      ),
    };
  }

  calculateHash(index, timestamp, data, previousHash, nonce) {
    return sha256(
      index + previousHash + timestamp + JSON.stringify(data) + nonce
    ).toString();
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  mineBlock(index, timestamp, data, previousHash) {
    let nonce = 0;
    let hash = this.calculateHash(index, timestamp, data, previousHash, nonce);

    while (!hash.startsWith(Array(this.difficulty + 1).join("0"))) {
      nonce++;
      hash = this.calculateHash(index, timestamp, data, previousHash, nonce);
    }

    return { nonce, hash };
  }

  addBlock(data) {
    const latestBlock = this.getLatestBlock();
    const index = this.chain.length;
    const timestamp = Date.now().toString();
    const { nonce, hash } = this.mineBlock(
      index,
      timestamp,
      data,
      latestBlock.hash
    );

    const newBlock = {
      index,
      timestamp,
      data,
      previousHash: latestBlock.hash,
      nonce,
      hash,
    };

    this.chain.push(newBlock);
    return newBlock;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (
        currentBlock.hash !==
        this.calculateHash(
          currentBlock.index,
          currentBlock.timestamp,
          currentBlock.data,
          currentBlock.previousHash,
          currentBlock.nonce
        )
      ) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

export default function Blockchain() {
  const [blockchain] = useState(new BlockchainLogic(3));
  const [blocks, setBlocks] = useState(blockchain.chain);
  const [newBlockData, setNewBlockData] = useState("");

  const mineBlock = () => {
    const newBlock = blockchain.addBlock(
      newBlockData || `Block ${blocks.length} data`
    );
    setBlocks([...blockchain.chain]);
    setNewBlockData("");
  };

  const validateChain = () => {
    alert(
      blockchain.isChainValid()
        ? "Blockchain is valid!"
        : "Blockchain is tampered!"
    );
  };

  return (
    <div className={s.blockchain}>
      <h1>Blockchain Simulation</h1>
      <input
        type="text"
        placeholder="Enter block data"
        value={newBlockData}
        onChange={(e) => setNewBlockData(e.target.value)}
        className={s.input}
      />
      <button onClick={mineBlock} className={s.button}>
        Mine Block
      </button>
      <button onClick={validateChain} className={s.button}>
        Validate Blockchain
      </button>
      <div className={s.chain}>
        {blocks.map((block) => (
          <Block
            key={block.index}
            index={block.index}
            timestamp={block.timestamp}
            data={block.data}
            hash={block.hash}
            previousHash={block.previousHash}
            nonce={block.nonce}
          />
        ))}
      </div>
    </div>
  );
}
