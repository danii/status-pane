import axios from "axios";
import "daniis-tools";
import {argv} from "process";

const gitHub: StatusProgram = {
	async setStatus(emoji: string, message: string, token: string) {
		const query = `mutation UpdateUserStatus {\n\tchangeUserStatus(input: {message: \"${message.escape()}\"}) {\n\t\tclientMutationId\n\t}\n}`;

		await axios({
			"method": "POST",
			"url": "https://api.github.com/graphql",
			"headers": {
				"authorization": `bearer ${token}`,
				"content-type": "application/graphql",
				"user-agent": "Daniihh"
			},
			"data": {
				"query": query
			}
		});
	}
};

const discord: StatusProgram = {
	async setStatus(emoji: string, message: string, token: string) {
		await axios({
			"method": "PATCH",
			"url": "https://discord.com/api/v8/users/@me/settings",
			"headers": {
				"authorization": `${token}`,
				"content-type": "application/json"
			},
			"data": {
				"custom_status": {
					"text": message
				}
			}
		})
	}
}

interface StatusProgram {
	setStatus(emoji: string, status: string, token: string): Promise<void>;
}

function main(...args: string[]) {
	const status = args[2];
	const config = require(`${__filename}/../config.json`);

	if (config.gitHub) {
		gitHub.setStatus("", status, config.gitHub);
	}

	if (config.discord) {
		discord.setStatus("", status, config.discord);
	}
}

main(...argv);
