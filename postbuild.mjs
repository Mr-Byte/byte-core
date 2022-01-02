import { promises as fs } from "fs";
import * as path from "path";

const outDir = path.join(process.env.LOCALAPPDATA, "FoundryVTT", "Data", "modules", "byte-core");
const outModuleFile = path.join(outDir, "module.json");
const srcModuleFile = path.join(path.resolve(), "module.json");
const srcLibDir = path.join(path.resolve(), "dist", "lib");

await fs.rm(outDir, { recursive: true, force: true });
await fs.mkdir(outDir);
await fs.copyFile(srcModuleFile, outModuleFile);
await fs.cp(srcLibDir, outDir, { recursive: true, force: true });
