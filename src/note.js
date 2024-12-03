import React, {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import './style.css';
import moment from 'moment';
export const Note = forwardRef(({ noteDetail, deleteDialogRef }, ref) => {
  const [head, SetHead] = useState(noteDetail.heading);
  const updateNoteDetails = (note) => {};
  // updateNoteDetails(note)
  useImperativeHandle(ref, () => ({
    update: (note) => {
      updateNoteDetails(note);
    },
  }));
  return (
    <div className="noteblock notebody ">
      <div className="nav ">
        <Headnote daate={moment(noteDetail.date)} />
        <div style = {{}}>
        <Ctrls
          deleteNote={(e) => {
            deleteDialogRef(e);
          }}
          Id={noteDetail.Id}
        />
        </div>
      </div>
      {noteDetail.heading ? (
        <div className="heading">
          <div className="notehead">
            <b>{noteDetail.heading} </b>
          </div>

          {noteDetail.tagline ? (
            <label>
              <center>{noteDetail.tagline}</center>
            </label>
          ) : undefined}
        </div>
      ) : undefined}
      <div className="m notebody"> {noteDetail.detail}</div>
    </div>
  );
});
export function Headnote({ daate }) {
  const dateR = useRef();

  return (
    <div className="notedate" ref={dateR}>
      {moment(daate).format('DD MMM yy')}
    </div>
  );
}
export function Ctrls({ deleteNote, Id }) {
  return (
    <div className="navctrls" >
      <button
        onClick={(e) => {
          deleteNote(e);
        }}
      >
        {'delete'}
      </button>
    </div>
  );
}
export default Note;
