import fs from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer-core";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const outputDir = path.resolve(".hero-video-frames");
const frameCount = 60;
const frameIntervalMs = 100;

await fs.rm(outputDir, { recursive: true, force: true });
await fs.mkdir(outputDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: true,
  args: ["--autoplay-policy=no-user-gesture-required", "--hide-scrollbars"],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 400, height: 470, deviceScaleFactor: 2 });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
  await page.waitForSelector(".hero .couple-video");

  await page.evaluate(async () => {
    const hero = document.querySelector(".hero");
    const video = document.querySelector(".couple-video");
    if (!(hero instanceof HTMLElement) || !(video instanceof HTMLVideoElement)) {
      throw new Error("Hero video was not found");
    }

    document.documentElement.classList.add("opened");
    document.documentElement.classList.remove("intro-active");
    document.body.replaceChildren(hero);
    Object.assign(document.documentElement.style, {
      width: "400px",
      height: "470px",
      overflow: "hidden",
      background: "transparent",
    });
    Object.assign(document.body.style, {
      width: "400px",
      height: "470px",
      minHeight: "0",
      margin: "0",
      overflow: "hidden",
      background: "transparent",
    });
    Object.assign(hero.style, {
      position: "fixed",
      inset: "0",
      width: "400px",
      height: "470px",
      margin: "0",
    });

    video.currentTime = 0;
    await video.play();
  });

  await new Promise((resolve) => setTimeout(resolve, 2200));

  for (let index = 0; index < frameCount; index += 1) {
    const startedAt = Date.now();
    const filename = `frame-${String(index).padStart(4, "0")}.png`;
    await page.screenshot({ path: path.join(outputDir, filename), omitBackground: false });
    const remaining = frameIntervalMs - (Date.now() - startedAt);
    if (remaining > 0) await new Promise((resolve) => setTimeout(resolve, remaining));
  }
} finally {
  await browser.close();
}

console.log(outputDir);
