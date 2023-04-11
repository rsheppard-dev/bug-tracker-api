import type { EntityId } from '@reduxjs/toolkit';
import { useNavigate } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';

import { useAppSelector } from '../../app/hooks';
import { selectProjectById } from './projectsApiSlice';

type Props = {
	projectId: EntityId | string;
};

function Project({ projectId }: Props) {
	const navigate = useNavigate();

	const project = useAppSelector(state => selectProjectById(state, projectId));

	if (project) {
		function handleEdit() {
			navigate(`/dash/projects/${projectId}`);
		}

		return (
			<tr>
				<td className='border border-slate-600'>{project.name}</td>
				<td className='border border-slate-600 truncate'>
					{project.description}
				</td>
				<td className='border border-slate-600'>{project.managersName}</td>
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
