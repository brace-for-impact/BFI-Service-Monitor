import { setupRoutes } from "./routes";
import { setupMiddlewares } from "./middlewares";
import shared from "@brace-for-impact/bfi-shared";
import * as socketServices from "./services/socket.services";

socketServices.socketExpressServerInit();
const {app, io, server} = socketServices.getSocketExpressServer()
setupMiddlewares(app);
setupRoutes(app);

export { server, io, app };
