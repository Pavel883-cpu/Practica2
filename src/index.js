import {parseArgs,printHelp} from "./cli.js";
async function main(){try{const o=parseArgs(process.argv.slice(2));if(o.help){console.log(printHelp());return;}for(const [k,v] of Object.entries(o))if(k!=="help")console.log(k+"="+v);}catch(e){console.error("Ошибка параметров: "+e.message);process.exitCode=2;}}
main();
