import Minio from 'minio'
import fs from 'fs'
import path from 'path'

const client = new Minio.Client({
  endPoint: process.env.S3_ENDPOINT || 'localhost',
  port: Number(process.env.S3_PORT || 9000),
  useSSL: false,
  accessKey: process.env.S3_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.S3_SECRET_KEY || 'minioadmin'
})

export async function ensureBucket(bucket = process.env.S3_BUCKET || 'entregas'){
  const exists = await client.bucketExists(bucket).catch(()=>false)
  if(!exists){
    await client.makeBucket(bucket)
  }
}

export async function uploadFile(stream: NodeJS.ReadableStream, filename: string, contentType = 'image/jpeg'){
  await ensureBucket()
  const bucket = process.env.S3_BUCKET || 'entregas'
  const metaData = { 'Content-Type': contentType }
  const objName = `${Date.now()}-${path.basename(filename)}`
  await client.putObject(bucket, objName, stream, metaData)
  const endpoint = process.env.S3_ENDPOINT || 'http://localhost:9000'
  // For MinIO dev: construct URL
  return `${endpoint}/${bucket}/${objName}`
}
