import React, { useRef, useState, createRef, useEffect } from 'react';
import './style.css';
import Pagination from './pagination.js';
import DelDialog from './Deleter.js';
import Note from './note';
import queries from './queries.js';
import Popup from './Popup.js';
import Pinner from './Pinner.js';

const pinSort = (Arr) => {
  return Arr.sort((a, b) =>
    !a.ispinned && b.ispinned ? 1 : a.ispinned == b.ispinned ? 0 : -1
  );
};
export default function App({ pageDefault = 1 }) {
  //console.log(queries.read().then(d=>console.log(d)).catch(e => console.log(e)));
  const [totalPages, setTotalPage] = useState(1);
  const [page, setPage] = useState(pageDefault);
  const popup = useRef();
  const delDialogRef = useRef();
  const pageRef = useRef(pageDefault);
  const elRefs = useRef({});
  const [NotesArray, setNotesArray] = useState([]);
  useEffect(() => {
    // fetch data
    const dataFetch = async () => {
      queries.totalPages().then((d) =>
      {
        setTotalPage(Math.ceil (d[0].count / 6 ));
        queries
        .read(6,page-1)
        .then((d) => setNotesArray(d))
        .catch((e) => {})}
      )
      .catch((e)=> {})
    };
    
    dataFetch();
  }, []);
  /*
   */
  let editingIndex = useRef(-1);
  const updatePage = (pageNo) => {
    pageRef.current.innerHTML = pageNo;
    setPage(pageNo);
    reload();
  };
  const updatePinCallback = (noteId, pin) => {
    let n = NotesArray.find((i) => i.id == noteId);
    n.ispinned = pin;
    setNotesArray(
      pinSort(NotesArray.map((note) => (note.id == noteId ? n : note)))
    );
    elRefs.current['el' + noteId].current.update(n);
    queries.update(n);
  };

  const handleClick = () => {
    queries.create().then((d) => {
      const noteAdded = d[0];
      editingIndex = {
        index: NotesArray.length,
        note: noteAdded,
        Id: noteAdded.id,
      };
      elRefs.current['el' + noteAdded.id] = createRef();
      setNotesArray((NotesArray) => [noteAdded, ...NotesArray.slice(0, 5)]);

      if (!popup.current.isOpen()) {
        const note = {
          notes: noteAdded,
          ref: {
            update: (n) => {
              setNotesArray((NotesArray) =>
                NotesArray.map((note) =>
                  note.id == editingIndex.Id ? n : note
                )
              );
              elRefs.current['el' + editingIndex.Id].current.update(n);
              queries.update(n);
            },
          },
          Delete: () => {},
        };
        popup.current.open(note);
        popup.current.focus();
      }
    });
  };
  const handleOpen = (note, i) => {
    editingIndex = { index: i, note: note, Id: note.id };
    if (!popup.current.isOpen()) {
      note = {
        notes: note,
        ref: {
          update: (n) => {
            setNotesArray((NotesArray) =>
              NotesArray.map((note) => (note.id == editingIndex.Id ? n : note))
            );
            elRefs.current['el' + editingIndex.Id].current.update(n);
            queries.update(n);
          },
        },
        Delete: () => {},
      };
      popup.current.open(note);
      popup.current.focus();
    }
  };
  for (var h = 0; h < NotesArray.length; h++) {
    elRefs.current['el' + NotesArray[h].id] =
      elRefs.current['el' + NotesArray[h].id] || createRef();
  }
  const reload = () => {
    queries
  .read()
  .then((d) => setNotesArray(d))
  .catch((e) => {});
  }

  
  return (
    <div id="noteroot">
      <span ref={pageRef}></span>
      <header className="header_bar_a1">
        <div className="header_bar_cntrls_common">
          <button type="button" onClick={handleClick}>
            New Note
          </button>
        </div>
        <br />
        <br />
        <br />
      </header>
      <DelDialog ref={delDialogRef} />
      <Popup ref={popup} open={false} />
      <div className="mainBox">
        {NotesArray.map((i, index) => (
          <div
            key={'e' + index}
            style={{ gridArea: 'el' + (index + 1), background: 'white' }}
            onClick={() => {
              handleOpen(NotesArray[index], index);
            }}
          >
            {' '}
            <Pinner
              isPinned={i.ispinned}
              updatePin={(pinState) => {
                updatePinCallback(NotesArray[index].id, pinState);
              }}
            />
            <Note
              deleteDialogRef={(e) => {
                delDialogRef.current.callDelete(i.id, reload);
                e.stopPropagation(); 
              }}
              noteDetail={NotesArray[index]}
              ref={elRefs.current['el' + NotesArray[index].id]}
            />
          </div>
        ))}
      </div>
      <Pagination
        totalPages={totalPages}
        pageNo={pageDefault}
        updatePageCallback={updatePage}
      />
    </div>
  );
}
