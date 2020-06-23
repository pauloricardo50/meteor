import { CHECKLIST_QUERIES } from './checklistConstants';
import Checklists from './checklists';

export const loanChecklists = Checklists.createQuery(
  CHECKLIST_QUERIES.LOAN_CHECKLISTS,
  { title: 1, description: 1, items: 1 },
);
