import React, { useEffect, useState } from 'react';
const APIurl = 'https://jsonplaceholder.typicode.com/posts';
const List = props => {
  console.count('rendering');
  const [items, setItems] = useState([]);

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.onmessage = event => {
      const message = JSON.parse(event.data);
      console.log(message.type);
      if (message && message.type === APIurl) {
        console.log('List of posts', message.data);
        setItems(message.data);
      }
    };
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(APIurl);
      const json = await response.json();
      setItems(json);
    };
    fetchData();
  }, []);

  return (
    <ul>
      {items.slice(0, 10).map(item => {
        return (
          <li key={item.id}>
            <h1>{item.title}</h1>
            <p>{item.body}</p>
          </li>
        );
      })}
    </ul>
  );
};

export default List;
