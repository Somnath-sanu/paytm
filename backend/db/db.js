import mongoose from "mongoose"


export const connect = async () => {
  try {
    await mongoose.connect(`mongodb://127.0.0.1:27017/payTM`)
  } catch (error) {
    console.log("Error while connecting Databases")
  }
}

