import taskState from "./atom";
import { selector } from "recoil";
import { Questionnaire, QuestionnaireResponse, Task } from "fhir/r4";
import { filterMap } from "../../utils";
import { questionnaireState } from "../quest";
import moment from "moment";
import { serversState } from "../servers";
import { questRespState } from "../questResp";
import patientState from "../patient";


export type Assessment = {
	id: [string, string],
	serverTitle: string,
	task: Task,
	questionnaire: Questionnaire,
	sentDate?: string,
	dueDate?: string,
	requesterName: string | undefined,
	response?: QuestionnaireResponse
}

const taskAssessmentState = selector<Assessment[]>({
	key: "taskAssessmentState",
	get: ({ get }) =>
		//todo: use ownedByPatient selector
		Object.entries(get(taskState)).flatMap(([serverId, tasks]) => filterMap(tasks, task => {
			const patientId = Object.values(get(patientState)).find(p => p.id === task.owner?.reference?.split("/")[1])?.id;
			const ownedByPatient = task.owner?.reference === `Patient/${patientId}`;
			const questURL = task.input?.find(item => item.valueCanonical)?.valueCanonical;
			const quest = get(questionnaireState)?.[serverId]?.find(q => q.url && q.url === questURL);
			const [outputId] = filterMap(task.output || [], out => out.valueReference?.reference?.match(/^QuestionnaireResponse\/(?<id>.+)/)?.groups?.id);
			const response = outputId ? get(questRespState)[serverId]?.find(resp => resp.id === outputId) : undefined;
			const server = get(serversState)[serverId];
			if (!ownedByPatient || !quest || !task.id || !server) {
				return false;
			}
			return {
				id: [serverId, task.id],
				serverTitle: server.title,
				task,
				questionnaire: quest as Questionnaire,
				sentDate: task.authoredOn ? moment(task.authoredOn).format("MMM DD, YYYY, hh:mm A") : undefined,
				dueDate: task?.restriction?.period?.end ? moment(task.restriction?.period?.end).format("MMM DD, YYYY, hh:mm A") : undefined,
				requesterName: task.requester?.display,
				response
			};
		}))
});

export default taskAssessmentState;
