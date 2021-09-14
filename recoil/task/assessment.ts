import taskState from "./atom";
import { selector } from "recoil";
import ownedByPatient from "./ownedByPatient";
import { Questionnaire, QuestionnaireResponse, Task } from "fhir/r4";
import { filterMap, mapHash } from "../../utils";
import { focusQuestionnaireState } from "../focus";
import moment from "moment";
import { serversState } from "../servers";
import { questRespState } from "../questResp";


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
		Object.entries(get(taskState)).flatMap(([serverId, tasks]) => filterMap(tasks, task => {
			const questId = task.focus?.reference?.match(/^Questionnaire\/(?<id>.+)/)?.groups?.id;
			const quest = get(focusQuestionnaireState)[serverId]?.find(q => q.id === questId);
			const [outputId] = filterMap(task.output || [], out => out.valueReference?.reference?.match(/^QuestionnaireResponse\/(?<id>.+)/)?.groups?.id);
			const response = outputId ? get(questRespState)[serverId]?.find(resp => resp.id === outputId) : undefined;
			const server = get(serversState)[serverId];
			if (!quest || !task.id || !server) {
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
