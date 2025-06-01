import {server} from "./app";
import { config } from "./config";
import shared from "@brace-for-impact/bfi-shared";
import consumeKafkaMessages from "./helpers/kafkaConsumer";
const port=config.port

const startServer = async () => {
    await shared.services.dockerServices.bootDockerServices()
    await shared.services.kafkaServices.initKafka({
        brokers: [`${config.SERVICE_NAME_KAFKA}:${config.KAFKA_CONTAINER_PORT}`],
        clientId: config?.clientId,
        groupId: config.KAFKA_CONSUMER_GROUP_ID,
    })
    consumeKafkaMessages()
    server.listen(port,()=>console.log(`Gateway Service running in ${port}`))
}

startServer()
