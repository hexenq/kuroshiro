import Kuroshiro from "kuroshiro";

const core: Kuroshiro = new Kuroshiro();
if (typeof core.convert !== "function") throw new Error("Invalid CommonJS default import");
