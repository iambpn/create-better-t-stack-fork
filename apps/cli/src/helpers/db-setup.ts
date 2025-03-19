import path from "node:path";
import { log, spinner } from "@clack/prompts";
import fs from "fs-extra";
import pc from "picocolors";
import { addPackageDependency } from "../utils/add-package-deps";
import { setupTurso } from "./turso-setup";

export async function setupDatabase(
	projectDir: string,
	databaseType: string,
	orm: string,
	setupTursoDb = true,
): Promise<void> {
	const s = spinner();
	const serverDir = path.join(projectDir, "packages/server");

	if (databaseType === "none") {
		await fs.remove(path.join(serverDir, "src/db"));
		return;
	}

	try {
		if (databaseType === "sqlite") {
			if (orm === "drizzle") {
				addPackageDependency({
					dependencies: ["drizzle-orm", "drizzle-kit", "@libsql/client"],
					devDependencies: false,
					projectDir: serverDir,
				});
				if (setupTursoDb) {
					await setupTurso(projectDir, true);
				}
			} else if (orm === "prisma") {
				addPackageDependency({
					dependencies: [
						"@prisma/client",
						"@prisma/adapter-libsql",
						"@libsql/client",
					],
					devDependencies: false,
					projectDir: serverDir,
				});
				addPackageDependency({
					dependencies: ["prisma"],
					devDependencies: true,
					projectDir: serverDir,
				});
				if (setupTursoDb) {
					await setupTurso(projectDir, true);
				}
			}
		} else if (databaseType === "postgres") {
			if (orm === "drizzle") {
				addPackageDependency({
					dependencies: ["drizzle-orm", "postgres"],
					devDependencies: false,
					projectDir: serverDir,
				});
				addPackageDependency({
					dependencies: ["drizzle-kit"],
					devDependencies: true,
					projectDir: serverDir,
				});
			} else if (orm === "prisma") {
				addPackageDependency({
					dependencies: ["@prisma/client"],
					devDependencies: false,
					projectDir: serverDir,
				});
				addPackageDependency({
					dependencies: ["prisma"],
					devDependencies: true,
					projectDir: serverDir,
				});
			}
		}
	} catch (error) {
		s.stop(pc.red("Failed to set up database"));
		if (error instanceof Error) {
			log.error(pc.red(error.message));
		}
		throw error;
	}
}
