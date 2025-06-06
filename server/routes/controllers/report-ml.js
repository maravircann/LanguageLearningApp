import { spawn } from "child_process";
import path from "path";

const getMLFeedback = (req, res) => {
  const userData = req.body;
  const scriptPath = path.resolve("ml/ml_predict.py");

  const py = spawn("python", [scriptPath]);

  let output = "";
  let errorOutput = "";

  py.stdout.on("data", (data) => {
    output += data.toString();
  });

  py.stderr.on("data", (data) => {
  console.error("STDERR Python:", data.toString());
});


  py.on("close", (code) => {
    if (code !== 0) {
      console.error("Script Python a eșuat:", errorOutput);
      return res.status(500).json({ error: "Eroare la generarea predicției" });
    }

    try {
      const result = JSON.parse(output);
      res.json(result);
    } catch (parseError) {
      console.error("Eroare parsare JSON:", parseError, output);
      res.status(500).json({ error: "Eroare la interpretarea răspunsului AI" });
    }
  });

  // trimitem JSON-ul către stdin
  py.stdin.write(JSON.stringify(userData));
  py.stdin.end();
};


export default {
  getMLFeedback
};
