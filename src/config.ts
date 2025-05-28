import dotenv from "dotenv";
import path from "path";
import shared from "@brace-for-impact/bfi-shared";
import { AxiosInstance } from "axios";

interface AppConfig {
  env: string;
  port: number;
  axios: AxiosInstance;
  SERVICE_NAME_KAFKA: string;
  KAFKA_CONTAINER_PORT: number;
  KAFKA_CONSUMER_GROUP_ID: string;
  clientId: string;
}
declare const __dirname: string;
const envFile = `.env.${process.env.NODE_ENV || "development"}`;

dotenv.config({
  path: path.resolve(__dirname, `../${envFile}`),
});

export const config: AppConfig = {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3000", 10),
  axios: shared.config.createAxiosInstance({
    baseURL: "http://localhost:3001",
    timeout: 5000,
    contentType: "application/json",
  }),
  SERVICE_NAME_KAFKA: process.env.SERVICE_NAME_KAFKA ?? "",
  KAFKA_CONTAINER_PORT: parseInt(process.env.KAFKA_CONTAINER_PORT ?? "0"),
  KAFKA_CONSUMER_GROUP_ID: process.env.KAFKA_CONSUMER_GROUP_ID ?? "",
  clientId: process?.env.clientId ?? ""
};
