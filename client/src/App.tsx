import { useEffect, useRef, useState } from "react";
import "./App.css";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { PointCloud, Point } from "./PointCloud";

function App() {
  const [streamData, setStreamData] = useState<{
    hello: string;
    points: Point[];
  } | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const [formValue, setFormValue] = useState<string>("");
  const [msgCount, setMsgCount] = useState<number>(0);

  const startEventSource = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const newEventSource = new EventSource("http://localhost:5000/sse");
    console.log("EventSource started!");

    newEventSource.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      setStreamData(data);
      setMsgCount((oldCount) => oldCount + 1);
    };

    newEventSource.onerror = () => {
      console.error("EventSource encountered an error.");
      newEventSource.close();
    };

    eventSourceRef.current = newEventSource;
  };

  const stopEventSource = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      console.log("EventSource stopped.");
    }
  };

  useEffect(() => {
    startEventSource();
    return () => stopEventSource();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    stopEventSource();

    console.log("Updating database with value:", formValue);
    await fetch("http://localhost:5000/update", {
      method: "POST",
      body: JSON.stringify({ name: "First Name", value: formValue }),
      headers: { "Content-Type": "application/json" },
    });

    console.log("Database updated.");
    startEventSource();
  };

  return (
    <div>
      <div>{streamData && streamData.hello}</div>
      <div>Count: {msgCount}</div>
      <form>
        <label>
          First Name
          <input
            type="text"
            name="value"
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
          />
        </label>
        <button onClick={handleFormSubmit} type="submit">
          Change Value
        </button>
      </form>
      {streamData?.points && (
        <div
          style={{ border: "1px solid pink", width: "80vw", height: "80vh" }}
        >
          <Canvas>
            <OrbitControls />
            <PointCloud points={streamData.points} />
          </Canvas>
        </div>
      )}
    </div>
  );
}

export default App;
