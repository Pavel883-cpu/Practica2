import path from "node:path";
const VALUE_OPTIONS = new Set(["--package", "--repository", "--version", "--output", "--max-depth"]);
const BOOLEAN_OPTIONS = new Set(["--test-mode", "--help"]);

export function parseArgs(argv) {
  const options = { package: null, repository: "https://registry.npmjs.org", testMode: false, version: "latest", output: "dependency-graph.dot", maxDepth: 3, help: false };
  const seen = new Set();
  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i];
    if (!VALUE_OPTIONS.has(flag) && !BOOLEAN_OPTIONS.has(flag)) throw new Error(\`Неизвестный параметр: \${flag}\`);
    if (seen.has(flag)) throw new Error(\`Параметр \${flag} указан повторно\`);
    seen.add(flag);
    if (flag === "--help") { options.help = true; continue; }
    if (flag === "--test-mode") { options.testMode = true; continue; }
    const value = argv[i + 1];
    if (!value || value.startsWith("--")) throw new Error(\`Для \${flag} требуется значение\`);
    i += 1;
    if (flag === "--package") options.package = value;
    if (flag === "--repository") options.repository = value;
    if (flag === "--version") options.version = value;
    if (flag === "--output") options.output = value;
    if (flag === "--max-depth") {
      if (!/^\d+$/.test(value)) throw new Error("--max-depth должен быть целым числом не меньше 0");
      options.maxDepth = Number(value);
    }
  }
  if (options.help) return options;
  if (!options.package) throw new Error("Обязательный параметр --package не задан");
  if (!/^(?:@[a-z0-9._-]+\/)?[a-z0-9._-]+$/i.test(options.package)) throw new Error("Некорректное имя npm-пакета");
  if (!options.version.trim()) throw new Error("--version не может быть пустой");
  if (!options.output.trim()) throw new Error("--output не может быть пустым");
  if (options.testMode) options.repository = path.resolve(options.repository);
  else { try { new URL(options.repository); } catch { throw new Error("--repository должен быть корректным URL"); } }
  return options;
}

export function printHelp() {
  return [
    "Использование: npm start -- --package <имя> [параметры]",
    "  --package <имя>       анализируемый npm-пакет (обязательно)",
    "  --repository <URL или путь> npm Registry или JSON-файл",
    "  --test-mode           локальный тестовый режим",
    "  --version <версия>    версия корневого пакета (latest)",
    "  --output <файл.dot>   имя выходного файла",
    "  --max-depth <N>       максимальная глубина BFS (3)",
    "  --help                справка"
  ].join("\n");
}
