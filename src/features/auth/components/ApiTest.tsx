import { useEffect, useState } from "react";
import  api  from "@/lib/api";

export default function ApiTest() {
  const [message, setMessage] = useState("Conectando...");

  useEffect(() => {
    api.get("/auth/ping")
      .then(res => setMessage(res.data.message))
      .catch(() => setMessage("❌ Error"));
  }, []);

  return <h1>{message}</h1>;
}
