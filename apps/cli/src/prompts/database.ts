import { cancel, isCancel, select } from "@clack/prompts";
import pc from "picocolors";
import { DEFAULT_CONFIG } from "../constants";
import type { ProjectDatabase } from "../types";

export async function getDatabaseChoice(
	database?: ProjectDatabase,
): Promise<ProjectDatabase> {
	if (database !== undefined) return database;

	const response = await select<ProjectDatabase>({
		message: "Select database",
		options: [
			{
				value: "none",
				label: "None",
				hint: "No database setup",
			},
			{
				value: "sqlite",
				label: "SQLite",
				hint: "by Turso",
			},
			{
				value: "postgres",
				label: "PostgreSQL",
				hint: "Traditional relational database",
			},
		],
		initialValue: DEFAULT_CONFIG.database,
	});

	if (isCancel(response)) {
		cancel(pc.red("Operation cancelled"));
		process.exit(0);
	}

	return response;
}
