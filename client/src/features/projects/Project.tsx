import type { EntityId } from '@reduxjs/toolkit';
import { useNavigate } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';

import { useAppSelector } from '../../app/hooks';
import { selectProjectsById } from './projectsApiSlice';
import { selectUsersById } from '../users/usersApiSlice';

type Props = {
	projectId: EntityId;
};

function Project({ projectId }: Props) {
	const navigate = useNavigate();

	const project = useAppSelector(state => selectProjectsById(state, projectId));

	if (project) {
		function handleEdit() {
			navigate(`/dash/projects/${projectId}`);
		}

		const managerData = useAppSelector(state =>
			selectUsersById(state, project.manager)
		);

		const manager = managerData
			? `${managerData.firstName} ${managerData.lastName}`
			: 'NA';

		return (
			<tr>
				<td className='border border-slate-600'>{project.name}</td>
				<td className='border border-slate-600 truncate'>
					{project.description}
				</td>
				<td className='border border-slate-600'>{manager}</td>
				<td className='border border-slate-600'>
					<button title='Edit' onClick={handleEdit}>
						<FaEdit />
					</button>
				</td>
			</tr>
		);
	} else return null;
}

export default Project;
