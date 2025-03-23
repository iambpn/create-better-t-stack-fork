import { cancel, isCancel, multiselect } from "@clack/prompts";
import pc from "picocolors";
import type { ProjectAddons } from "../types";

export async function getAddonsChoice(
	Addons?: ProjectAddons[],
): Promise<ProjectAddons[]> {
	if (Addons !== undefined) return Addons;

	const response = await multiselect<ProjectAddons>({
		message: "Which Addons would you like to add?",
		options: [
			{
				value: "pwa",
				label: "PWA (Progressive Web App)",
				hint: "Make your app installable and work offline",
			},
			{
				value: "tauri",
				label: "Tauri Desktop App",
				hint: "Build native desktop apps from your web frontend",
			},
			{
				value: "biome",
				label: "Biome",
				hint: "Add Biome for linting and formatting",
			},
			{
				value: "husky",
				label: "Husky",
				hint: "Add Git hooks with Husky, lint-staged (requires Biome)",
			},
		],
		required: false,
	});

	if (isCancel(response)) {
		cancel(pc.red("Operation cancelled"));
		process.exit(0);
	}

	if (response.includes("husky") && !response.includes("biome")) {
		response.push("biome");
	}

	return response;
}
