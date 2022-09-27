import app from "./app";
import { pingRouter } from "./router/pingRouter";
import { userRouter } from "./router/userRouter";
import { postRouter } from "./router/postRouter";

app.use("/ping", pingRouter);
app.use("/users", userRouter);
app.use("/posts", postRouter);
