import dotenv from "dotenv"
dotenv.config({ quiet: true })



import { ConnectDb } from "./db/index.ts"
import app from "./app.ts"



// --- connecting to DB -------------------------------
const port = process.env.PORT || 4000;

ConnectDb().then(() => {
  app.listen(port, () => {
    console.log("Server is listening at port ---> ", port)
  })
}).catch(error => {
  console.error("Error conneciting to db ---> ", error)
})



