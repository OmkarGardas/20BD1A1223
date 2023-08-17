const express = require("express");
const axios = require("axios");

const app = express();
const port = 8008;

app.get("/numbers", async (req, res) => {
  const urls = req.query.url;
  console.log(urls);
  if (!urls || !Array.isArray(urls)) {
    return res.status(422).json({ error: "Inavlid URL parameters" });
  }

  try {
    const fetchPromises = Array.isArray(urls)
      ? urls.map((url) => fetchWithTimeout(url))
      : [fetchWithTimeout(urls)];

    const responses = await Promise.all(fetchPromises);

    const validResponses = responses.filter(
      (response) => response.status === 200
    );

    const mergedNumbers = validResponses
      .map((response) => response.data.numbers)
      .flat();

    const uniqueSortedNumbers = Array.from(new Set(mergedNumbers)).sort(
      (a, b) => a - b
    );

    res.json({ numbers: uniqueSortedNumbers });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "An error occurred while fetching numbers" });
  }
});

async function fetchWithTimeout(url) {
  try {
    const response = await axios.get(url, { timeout: 500 }); 
    return response;
  } catch (error) {
    return error;
  }
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
