const PersonForm = ({
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange,
  addNewItem,
}) => {
  return (
    <form>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit" onClick={addNewItem}>
          add
        </button>
      </div>
    </form>
  );
};

export default PersonForm;
