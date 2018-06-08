import sinon from 'sinon';
// expose the queries in tests,
// so that we can use the queries from the client tests
import tasksQuery from '../../api/tasks/queries/tasks';
import '../../api/tasks/queries/exposures';

// stub the firewall of tasksQuery
sinon.stub(tasksQuery.exposeConfig, 'firewall').callsFake(() => {});
