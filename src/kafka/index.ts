import shared from "@brace-for-impact/bfi-shared";
import { emitKafkaMessage } from "../socket/socketService";
import { config } from "../config";

export const startKafkaConsumer = async () => {
  const kafka = await shared.services.kafkaServices.getKafkaServices({
    clientId: config.clientId,
    brokers: [`${config.SERVICE_NAME_KAFKA}:${config.KAFKA_CONTAINER_PORT}`],
    groupId: config.KAFKA_CONSUMER_GROUP_ID,
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