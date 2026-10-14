import {spawnSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
process.env.HAYWEB_BUILD_TARGET = 'production';
const packagePath=import.meta.resolve('astro/package.json');
const astroPackage=JSON.parse(readFileSync(new URL(packagePath),'utf8'));
const executable=fileURLToPath(new URL(astroPackage.bin.astro,packagePath));
const result=spawnSync(process.execPath,[executable,'build'],{stdio:'inherit',env:process.env});
process.exit(result.status ?? 1);
