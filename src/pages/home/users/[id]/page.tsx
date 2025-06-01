import { useParams } from 'react-router-dom';

export default function Page() {
  const { id } = useParams<{ id: string }>();
  return <div>Product ID: {id}</div>;
}
