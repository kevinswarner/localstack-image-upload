import { ensureBucket, getUploadUrl } from "../../lib/s3.js";

export default async function handler(req, res) {
  await ensureBucket();
  const { name, type } = req.body;
  const key = `/${name}`;
  const url = await getUploadUrl(key, type);
  res.status(200).json({ url });
}
