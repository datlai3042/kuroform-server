import mongoose, { Mongoose } from 'mongoose'
import { config } from 'dotenv'

config()

class MongoConnect {
      static connect: Promise<Mongoose>
      static async Connect(): Promise<Mongoose> {
            if (!MongoConnect.connect) {
                  MongoConnect.connect = mongoose.connect(
                        process.env.MODE === ('DEV' as string) ? (process.env.MONGO_URI as string) : (process.env.MONGO_URI as string)
                  )

                  MongoConnect.connect
                        .then(() => console.log('Kết nối Database thành công'))
                        .catch((e) => console.log(`Kết nối database xuất hiện lỗi::${e}`))

                  return MongoConnect.connect
            }

            return MongoConnect.connect
      }
}

export default MongoConnect
