import { Types } from 'mongoose'
import { Document, ObjectId, Schema, model } from 'mongoose'

const DOCUMENT_NAME = 'KeyStore'
const COLLECTION_NAME = 'keyStores'

type KeyManagerSchema = {
      user_id: Types.ObjectId
      public_key: string
      private_key: string
      code_verify_token: string
      refresh_token: string
      refresh_token_used: string[]
}

export type KeyManagerDocument = Document & KeyManagerSchema

const keyManagerSchema = new Schema<KeyManagerDocument>(
      {
            user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
            public_key: { type: String, required: true },
            private_key: { type: String, required: true },
            code_verify_token: { type: String, required: true },
            refresh_token: { type: String, required: true },
            refresh_token_used: { type: [String], required: true }
      },
      { collection: COLLECTION_NAME, timestamps: true }
)

const keyManagerModel = model<KeyManagerDocument>(DOCUMENT_NAME, keyManagerSchema)

export default keyManagerModel
