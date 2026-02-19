const requiredMajor = 20;
const requiredMinor = 19;

const [majorStr, minorStr] = process.versions.node.split(".");
const major = Number(majorStr);
const minor = Number(minorStr);

const isSupported =
  major > requiredMajor || (major === requiredMajor && minor >= requiredMinor);

if (!isSupported) {
  console.error(
    `\nUnsupported Node.js version: ${process.versions.node}.\n` +
      `This project requires Node.js >= ${requiredMajor}.${requiredMinor}.0 (Vite 7 + toolchain requirement).\n` +
      "Install a compatible Node version, then run npm install again.\n"
  );
  process.exit(1);
}
