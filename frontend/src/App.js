import { useEffect, useMemo, useState, useRef } from "react";
import networkService from "./service";
import { Filter, PersonForm, Persons, Notification } from "./components";
import "./App.css";

const tranArrToObj = (arr) =>
  arr.reduce((cur, item) => {
    cur[`${item.id}`] = item;
    return cur;
  }, {});

const tranObjToArr = (obj) => Reflect.ownKeys(obj).map((item) => obj[item]);

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [queryWord, setQueryWord] = useState("");
  const [message, setMessage] = useState({});
  const personsObj = useRef({});

  useEffect(() => {
    const getList = async () => {
      const res = await networkService.getAll();
      setPersons(res);
    };
    getList();
  }, []);

  useMemo(() => {
    personsObj.current = tranArrToObj(persons);
  }, [persons]);

  const judgeExist = (name) => {
    return persons.some((item) => item.name === name);
  };

  const findPerson = (name) => {
    return persons.filter((item) => item.name === name);
  };

  const resetInput = () => {
    setNewName("");
    setNewNumber("");
  };

  const addNewItem = async (event) => {
    const obj = {
      name: newName.trim(),
      number: newNumber.trim(),
    };
    if (judgeExist(obj.name)) {
      if (
        window.confirm(
          `${newName.trim()} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        event.preventDefault();
        obj.id = findPerson(obj.name)[0].id;

        let tempMsg = {};

        try {
          const data = await networkService.updateItem(obj);
          tempMsg = { status: "success", message: `Updated ${obj.name}` };
          personsObj.current[obj.id] = data;
          setPersons(tranObjToArr(personsObj.current));
        } catch (error) {
          tempMsg = {
            status: "error",
            message: `Information of ${obj.name} has already been removed from server`,
          };
        } finally {
          setMessage(tempMsg);
          setTimeout(() => {
            setMessage({});
          }, 3000);
        }

        resetInput();
      }
    } else {
      event.preventDefault();

      let tempMsg = {};

      try {
        await networkService.createItem(obj);
        tempMsg = { status: "success", message: `Added ${obj.name}` };
        setPersons(persons.concat(obj));
      } catch (error) {
        if (error.response?.data?.type === "ValidationError") {
          tempMsg = {
            status: "error",
            message: error.response.data.error,
          };
        } else {
          tempMsg = {
            status: "error",
            message: `Information of ${obj.name} has already been removed from server`,
          };
        }
      } finally {
        setMessage(tempMsg);
        setTimeout(() => {
          setMessage({});
        }, 6000);
      }

      resetInput();
    }
  };

  const deleteItem = (id) => {
    if (window.confirm(`Delete ${personsObj.current[id].name} ?`)) {
      const afterDelete = persons.filter((item) => item.id !== id);
      networkService.deleteItem(id);
      setPersons(afterDelete);
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleQueryWord = (event) => {
    setQueryWord(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message}></Notification>
      <Filter queryWord={queryWord} handleQueryWord={handleQueryWord} />
      <h2>add a new</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addNewItem={addNewItem}
      />
      <h2>Numbers</h2>
      <Persons
        persons={persons}
        queryWord={queryWord}
        deleteItem={deleteItem}
      />
    </div>
  );
};

export default App;
