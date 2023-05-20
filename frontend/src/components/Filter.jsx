const Filter = ({ queryWord, handleQueryWord }) => {
  return (
    <div>
      filter shown with
      <input value={queryWord} onChange={handleQueryWord} />
    </div>
  );
};

export default Filter;
