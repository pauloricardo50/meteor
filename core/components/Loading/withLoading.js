import { branch, renderComponent } from 'recompose';
import Loading from './Loading';

export default branch(({ loading }) => loading, renderComponent(Loading));
