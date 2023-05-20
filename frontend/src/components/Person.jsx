const Persons = ({ persons, queryWord, deleteItem }) => {
  return (
    <>
      {persons
        .filter((person) =>
          person.name.toLowerCase().includes(queryWord.toLowerCase())
        )
        .map((person) => {
          return (
            <p key={person.id}>
              {person.name} {person.number}{" "}
              <button onClick={() => deleteItem(person.id)}>delete</button>
            </p>
          );
        })}
    </>
  );
};

export default Persons;
