const fs = require("fs");
const util = require("util");
const readFileAsync = util.promisify(fs.readFile);

async function main() {
  const minBrightness = 0;
  let maxBrightness = 0;
  const dir = "/sys/class/backlight/intel_backlight/";
  const brightnessFile = dir + "brightness";
  const maxBrightnessFile = dir + "max_brightness";

  try {
    const maxBrightnessData = await readFileAsync(maxBrightnessFile);
    maxBrightness = parseInt(maxBrightnessData.toString().trim());
  } catch (err) {
    console.error("Could not read max brightness:", err);
    return;
  }

  if (maxBrightness === 0) {
    console.error("Could not set max brightness");
    return;
  }

  try {
    const brightnessData = await readFileAsync(brightnessFile);
    const brightness = parseInt(brightnessData.toString().trim());
    let newBrightness = brightness;

    const arg = process.argv[2];
    if (!arg) {
      console.error("Arg missing: -i to increase -d for decrease");
      return;
    }

    const increments = 5000;
    if (arg === "i") {
      newBrightness += increments;
    } else if (arg === "d") {
      newBrightness -= increments;
    }

    if (newBrightness < minBrightness) newBrightness = minBrightness;
    if (newBrightness > maxBrightness) newBrightness = maxBrightness;

    fs.writeFile(brightnessFile, newBrightness.toString(), () => {});
  } catch (err) {
    console.error("Error reading brightness:", err);
  }
}

main();
