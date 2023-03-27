import { getModelForClass } from '@typegoose/typegoose';

import { Comment } from './comment.model';
import { Project } from './project.model';
import { Team } from './team.model';
import { Ticket } from './ticket.model';
import { User } from './user.model';

const CommentModel = getModelForClass(Comment);
const ProjectModel = getModelForClass(Project);
const TeamModel = getModelForClass(Team);
const TicketModel = getModelForClass(Ticket);
const UserModel = getModelForClass(User);

export { CommentModel, ProjectModel, TeamModel, TicketModel, UserModel };
