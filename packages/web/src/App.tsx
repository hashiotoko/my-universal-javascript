import { useState } from 'react';
import { request } from 'graphql-request';

const url = 'http://localhost:4000/graphql';

const query = `
  query getMemberList {
    memberList {
      id,
      name,
      age,
    }
  }
`;

function App() {
  const [memberList, setMemberList] = useState([]) as any;

  const graphQL = async () => {
    const result: any = await request(url, query);
    console.log(JSON.stringify(result));
    setMemberList(result.memberList);
  };

  return (
    <>
      <h1>My Universal Javascript</h1>
      <div>
        <button onClick={graphQL}>Click</button>
        {memberList.map((member: any) => {
          return <p>{`id: ${member.id}, name: ${member.name}`}</p>;
        })}
      </div>
    </>
  );
}

export default App;
