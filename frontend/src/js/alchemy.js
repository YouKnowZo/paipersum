// Example usage of Alchemy SDK
import { Network, Alchemy } from "alchemy-sdk";

const settings = {
  apiKey: "pYowOdAuh3xI0WwO8TCQn", // Replace with your Alchemy API Key.
  network: Network.ETH_MAINNET, // Replace with your network.
};
const alchemy = new Alchemy(settings);

// Example: Fetch and log a block
alchemy.core.getBlock(15221026).then(console.log);
