import { server, io } from "./app";
import { config } from "./config";
import shared from "@brace-for-impact/bfi-shared";

const port = config.port;

const startServer = async () => {
  await shared.services.dockerServices.bootDockerServices();
  await shared.services.kafkaServices.initKafka({
    brokers: [`${config.SERVICE_NAME_KAFKA}:${config.KAFKA_CONTAINER_PORT}`],
    clientId: config?.clientId,
    groupId: config.KAFKA_CONSUMER_GROUP_ID,
  });
  server.listen(port, () => console.log(`Gateway Service running in ${port}`));
  shared.services.kafkaServices.consume({
    topics: ["service-health"],
    onMessage: async ({ topic, message }) => {
      const key = message.key?.toString();
      const value = message.value?.toString();
      console.log(`[Kafka] ➡️ Received from ${topic}: ${key}`);
      io.emit("kafka:message",  value);
    },
  });
};

startServer();
