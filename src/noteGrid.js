export default function ({ notesList, deleteCallback, edit }) {
  [notes, setNotes] = useState(notesList);
  const updatePinState = (note_id) => {
    setNotes((notes) => {
      notes[note_id]
        ? (notes[note_id].isPinned = !notes[note_id].isPinned)
        : '';
      return notes;
    });
  };
  const deleteNote = (note_id) => {
    setNotes((notes) => {
      //are you sure you want to delete;
      deleteCallback(notes[note_id]);
      return notes;
    });
  };
  return (
    <div>
      {notes.map((n) => (
        <Note
          onClick={edit(n.Id)}
          noteDetail={n}
          updatePinState={updatePinState(n.Id)}
          delete={deleteNote(n.Id)}
        />
      ))}
    </div>
  );
}
