import { execSync } from "child_process";
import { existsSync, writeFileSync, readFileSync, unlinkSync } from "fs";
import { join } from "path";
import process from "process";

const runCommand = (command) => {
  console.log(`\n▶️ Running: ${command}`);
  try {
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.error(`❌ Command failed: ${command}\n`, error.message);
    throw error; // Let finally run and clean up
  }
};

// Determine bump type from CLI arg
const bumpType = process.argv[2] || "patch";
const validBumps = ["patch", "minor", "major"];
if (!validBumps.includes(bumpType)) {
  console.error(`❌ Invalid bump type: "${bumpType}". Use patch, minor, or major.`);
  process.exit(1);
}

// Prevent re-entry
const FLAG_FILE = ".publish_lock";
if (existsSync(FLAG_FILE)) {
  console.log("⚠️ Publish script already ran. Exiting...");
  process.exit(0);
}
writeFileSync(FLAG_FILE, "Publishing in progress");

try {
  const packageJsonPath = join(process.cwd(), "package.json");
  const getPackageJson = () =>
    JSON.parse(readFileSync(packageJsonPath, "utf8"));

  const packageName = getPackageJson().name;

  // Fetch published versions
  const publishedVersions = JSON.parse(
    execSync(`npm view ${packageName} versions --json`).toString()
  );

  // Bump until version is unique
  let tries = 0;
  while (publishedVersions.includes(getPackageJson().version)) {
    if (tries > 10) {
      throw new Error("🚫 Too many version bump attempts.");
    }

    console.log(
      `⚠️ Version ${getPackageJson().version} already exists. Bumping ${bumpType}...`
    );
    runCommand(`standard-version --release-as ${bumpType} --skip.tag --skip.commit`);
    tries++;
  }

  const newVersion = getPackageJson().version;
  console.log(`✅ Version bumped to: ${newVersion}`);

  // Build the library
  console.log("🏗️ Building the library...");
  runCommand("npm run build:lib");

  // Publish to npm
  console.log("📦 Publishing to npm...");
  runCommand("npm publish");

  // Git commit + tag + push
  runCommand(`git add . && git commit -m "release: v${newVersion}"`);
  runCommand(`git tag v${newVersion}`);
  runCommand("git push --follow-tags");

  console.log(`🚀 Successfully published v${newVersion} to npm`);
} catch (error) {
  console.error("❌ Publishing failed:", error.message);
  throw error;
} finally {
  try {
    if (existsSync(FLAG_FILE)) {
      unlinkSync(FLAG_FILE);
      console.log("🧹 Cleaned up .publish_lock");
    }
  } catch (err) {
    console.warn("⚠️ Could not remove .publish_lock:", err);
  }
}
