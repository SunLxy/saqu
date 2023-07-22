import minimist from 'minimist';
import path from 'path';
import { create } from 'create-kkt';
import fs from 'fs-extra';

const helpExample: string = `Example:

    \x1b[35myarn\x1b[0m create saqu \x1b[33mappName\x1b[0m
    \x1b[35mnpx\x1b[0m create-saqu \x1b[33mmy-app\x1b[0m
    \x1b[35mnpm\x1b[0m create saqu \x1b[33mmy-app\x1b[0m
    \x1b[35mnpm\x1b[0m create saqu \x1b[33mmy-app\x1b[0m -f
    \x1b[35mnpm\x1b[0m create saqu \x1b[33mmy-app\x1b[0m -p \x1b[34mhttps://sunlxy.github.io/saqu/zip/\x1b[0m
`;

const helpCli: string = `
  Usage: create-saqu <app-name> [options] [--help|h]

  Options:

    --version, -v   Show version number
    --help, -h      Displays help information.
    --output, -o    Output directory.
    --example, -e   Example from: \x1b[34mhttps://github.com/SunLxy/saqu\x1b[0m, default: "routes"
    --path, -p      Specify the download target git address.
                      default: "\x1b[34mhttps://sunlxy.github.io/saqu/zip/\x1b[0m"
  
  ${helpExample}
  
  Copyright 2023
`;
async function run(): Promise<void> {
  const argvs = minimist(process.argv.slice(2), {
    alias: {
      output: 'o',
      version: 'v',
      force: 'f',
      path: 'p',
      example: 'e',
    },
    default: {
      path: 'https://sunlxy.github.io/saqu/zip/',
      output: '.',
      force: false,
      example: 'routes',
    },
  });
  if (argvs.h || argvs.help) {
    console.log(helpCli);
    return;
  }
  const { version } = require('../package.json');
  if (argvs.v || argvs.version) {
    console.log(`\n create-saqu v${version}\n`);
    return;
  }
  argvs.appName = argvs._[0] || 'example';
  argvs.example = argvs.e = String(argvs.example).toLocaleLowerCase();
  try {
    await create(argvs, helpExample);
    const pkgPath = path.join(process.cwd(), argvs.output, argvs.appName, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = require(pkgPath);
      if (pkg.version) {
        await fs.writeJSON(pkgPath, { ...pkg, name: argvs.appName || pkg.name, version: '1.0.0' }, { spaces: '  ' });
      }
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
