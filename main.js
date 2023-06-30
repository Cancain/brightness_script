const fs = require("fs");
const util = require("util");
const readFileAsync = util.promisify(fs.readFile);

async function main() {
  const minBrightness = 1200;
  let maxBrightness = 0;
  const dir = "/sys/class/backlight/intel_backlight/";
  const brightnessFile = dir + "brightness";
  const maxBrightnessFile = dir + "max_brightness";

  try {
    const maxBrightnessData = await readFileAsync(maxBrightnessFile);
    maxBrightness = parseInt(maxBrightnessData.toString().trim());
    console.log("Max Brightness:", maxBrightness);
  } catch (err) {
    console.error("Could not read max brightness:", err);
    return;
  }

  if (maxBrightness === 0) {
    console.error("Could not set max brightness");
    console.log("Max Brightness:", maxBrightness);
    return;
  }

  try {
    const brightnessData = await readFileAsync(brightnessFile);
    const brightness = parseInt(brightnessData.toString().trim());
    let newBrightness = brightness;
    console.log("Current Brightness:", brightness);

    const arg = process.argv[2];
    if (!arg) {
      console.error("Arg missing: -i to increase -d for decrease");
      return;
    }
    console.log("Arg:", arg);

    const increments = 10000;
    if (arg === "i") {
      newBrightness += increments;
    } else if (arg === "d") {
      newBrightness -= increments;
    }
    console.log("New Brightness:", newBrightness);

    if (newBrightness < minBrightness) newBrightness = minBrightness;
    if (newBrightness > maxBrightness) newBrightness = maxBrightness;

    fs.writeFile(brightnessFile, newBrightness.toString(), (err, res) => {});
  } catch (err) {
    console.error("Error reading brightness:", err);
  }
}

main();
