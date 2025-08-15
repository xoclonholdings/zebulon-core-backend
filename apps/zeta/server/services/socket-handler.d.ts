import { Server as SocketServer } from "socket.io";
import { Server } from "http";
export declare function setupSocketHandlers(httpServer: Server): SocketServer<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
