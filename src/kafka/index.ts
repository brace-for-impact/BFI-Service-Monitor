import shared from "@brace-for-impact/bfi-shared";
import { emitKafkaMessage } from "../socket/socketService";

export const startKafkaConsumer = async () => {
  const kafka = await shared.services.kafkaServices.getKafkaServices({
    clientId: "monitor-service",
    brokers: [process.env.KAFKA_BROKERS || "bfi-dev-kafka:9092"],
    groupId: process.env.KAFKA_CONSUMER_GROUP_ID || "monitor-service-group",
  });

  await kafka.consume({
    topics: ["monitor-events"],
    onMessage: async ({ topic, message }) => {
      const key = message.key?.toString();
      const value = message.value?.toString();
      console.log(`[Kafka] ➡️ Received: ${key} → ${value}`);
      emitKafkaMessage(value || "");
    },
  });
};