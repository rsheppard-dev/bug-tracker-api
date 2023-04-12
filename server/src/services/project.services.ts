import { ProjectModel } from '../models';
import { Project } from '../models/project.model';

export function createProject(project: Partial<Project>) {
	return ProjectModel.create(project);
}

export async function findProjectById(id: string) {
	return ProjectModel.findById(id);
}
