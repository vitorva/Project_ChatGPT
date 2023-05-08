import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [partInput, setPartInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ part: partInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result);
      setPartInput("");
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI workout plan</title>
        <link rel="icon" href="/sport.png" />
      </Head>
      <main className={styles.main}>
        <img src="/sport.png" />
        <h3>Generate a workout plan </h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="part"
            placeholder="Enter a part of your body"
            value={partInput}
            onChange={(e) => setPartInput(e.target.value)}
          />
          <input type="submit" value="Generate a workout plan" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
