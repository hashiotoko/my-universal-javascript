import { useState } from 'react';
import { request } from 'graphql-request';

const port = import.meta.env.VITE_BACKEND_PORT || 4000;
const url = `http://localhost:${port}/graphql`;
console.log(`backend endpoint: ${url}`);

const query = `
  query getUsers {
    users {
      id,
      name,
      age,
    }
  }
`;

function App() {
  const [users, setUsers] = useState([]) as any;

  const graphQL = async () => {
    const result: any = await request(url, query);
    console.log(JSON.stringify(result));
    setUsers(result.users);
  };

  return (
    <>
      <h1>Javascript Playground</h1>
      <div>
        <button onClick={graphQL}>Click</button>
        {users.map((user: any) => {
          return <p>{`id: ${user.id}, name: ${user.name}`}</p>;
        })}
      </div>
    </>
  );
}

export default App;
