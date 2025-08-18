import { Socket, Server } from "socket.io";
import { Message } from "./models/Message";

export const socketHandler = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        console.log("User connected", socket.id);

        socket.on("joinGroup", (groupId: string) => {
            socket.join(groupId);
            console.log(`User joined group: ${groupId}`);
        });

        socket.on("sendMessage", async ({ groupId, senderId, content }) => {
            try {
                const message = new Message({
                    groupId,
                    senderId,
                    content
                });

                const savedMsg = await message.save();
                const populatedMsg = await savedMsg.populate("senderId", "name email");

                io.to(groupId).emit("newMessage", populatedMsg);
            } catch (err) {
                console.error("Failed to save message", err);
                socket.emit("messageError", { error: "Failed to send message" });
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected", socket.id);
        });
    });
};