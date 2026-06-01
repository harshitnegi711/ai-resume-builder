import mongoose from "mongoose"


export const ConnectDb = async () => {
  try {
    const connection = await mongoose.connect(`${process.env.MONGODB_URI}/ai-resume`)
    console.log("host ---> ", connection.connection.host)

  } catch (error) {
    console.error("Error connecting to Mongo -----> ", error)
  }
}
