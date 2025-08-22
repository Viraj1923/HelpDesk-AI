import { useState } from "react";

function Settings() {
  const [threshold, setThreshold] = useState(
    localStorage.getItem("confidenceThreshold") || 0.8
  );

  const updateThreshold = () => {
    localStorage.setItem("confidenceThreshold", threshold);
    alert(`Threshold updated to ${threshold}`);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Settings</h2>
      <label className="block mb-2">Confidence Threshold</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <input
        type="number"
        step="0.1"
        min="0"
        max="1"
        value={threshold}
        onChange={(e) => setThreshold(e.target.value)}
        className="border p-2 rounded"
      />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <button
        onClick={updateThreshold}
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Save
      </button>
    </div>
  );
}

export default Settings;
