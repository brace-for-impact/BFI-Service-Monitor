import shared from "@brace-for-impact/bfi-shared";
import { sendSocketMessage } from "../socket/socketService";

const consumeKafkaMessages = async () => {
  await shared.services.kafkaServices.consume({
    topics: ["monitor-events"],
    onMessage: async ({ topic, message }) => {
      const key = message.key?.toString();
      const value = message.value?.toString();
      console.log(`[Kafka] ➡️ Received from ${topic}: ${key} → ${value}`);
      sendSocketMessage(value || "");
    },
  });
};

export default consumeKafkaMessages