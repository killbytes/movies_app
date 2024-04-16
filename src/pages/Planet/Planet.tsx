import { useParams } from 'react-router-dom';
//import css from './Planet.module.scss'

function Planet() {
  const { planetId } = useParams();

  return <>planetId: {planetId}</>;
}
export default Planet;
