const helpStr = `
  Usage: saqu [start|build] [--help|h]
    Displays help information.
  Options:
    --help, -h              Displays help information.
  Example:
  $ \x1b[35msaqu\x1b[0m  build
  $ \x1b[35msaqu\x1b[0m  start
`;
export const help = () => {
  console.log(helpStr);
};
