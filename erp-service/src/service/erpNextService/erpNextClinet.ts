// lib/erpNextClient.ts
import axios from "axios";

export const getErpNextClient = (baseUrl: string, apiKey: string, apiSecret: string) => {
  const client = axios.create({
    baseURL: `${baseUrl}`,
    headers: {
      Authorization: `token ${apiKey}:${apiSecret}`,
      "Content-Type": "application/json",
    },
  });

  return client;
};
