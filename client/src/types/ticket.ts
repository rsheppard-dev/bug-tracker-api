export interface Ticket {
	id: string;
	title: string;
	description: string;
	category: Category;
	priority: Priority;
	completed: boolean;
	createdAt: Date;
	updatedAt: Date;
}

enum Category {
	DESIGN = 'DESIGN',
	BUG = 'BUG',
	FEATURE = 'FEATURE',
	SECURITY = 'SECURITY',
}

enum Priority {
	LOW = 'LOW',
	MODERATE = 'MODERATE',
	HIGH = 'HIGH',
}
