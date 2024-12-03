import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
} from 'react';
import ReactDOM from 'react-dom';
import { useOnClickOutside } from './hooks.js';
import queries from './queries.js';

export const DelDialog = forwardRef(({ NoteId }, ref) => {
  const contentRef = useRef();
  const getRootPopup = () => {
    let PopupRoot = document.getElementById('popup-delete');
    if (PopupRoot === null) {
      PopupRoot = document.createElement('div', { id: 'popup-delete' });
      PopupRoot.setAttribute('id', 'popup-delete');
      document.body.appendChild(PopupRoot);
    }
    return document.getElementById('popup-delete');
  };
  const [open, isOpen] = useState(false);
  const [handler, setHandler] = useState();
  //let handler = () => {};

  useImperativeHandle(ref, () => ({
    callDelete: (Id, callback) => {
      NoteId = Id;
      setHandler(callback);
      isOpen(NoteId);
    },
  }));
  const deleteN = (Id, active) => {
    //console.log(open, handler, active)
    if (active) {
      queries.Delete(open).then((d) => {
        //handler();
      })
      .catch(e => console.log("handler", e));
    }
    isOpen(false);
  };

  useOnClickOutside([contentRef], deleteN);

  const content = (
    <div
      style={{
        position: 'fixed',
        top: 30 + '%',
        left: 30 + '%',
        height: '100px',
        width: '150px',
        background: 'white',
        padding: '20px',
        zIndex: 9999,
        margin: 'auto',
        justifyContent: 'center',
        border: '1px dotted sandybrown',
        pointerEvents: 'auto',
      }}
    >
      Are you sure you want to delete?
      <div
        style={{
          display: 'flex',
          marginTop: 20 + 'px',
          justifyContent: 'space-around',
        }}
        ref={contentRef}
      >
        <button
          onClick={() => {
            deleteN(NoteId, true);
          }}
        >
          ok
        </button>
        <button
          onClick={() => {
            deleteN();
          }}
        >
          cancel
        </button>
      </div>
    </div>
  );
  return <>{open && ReactDOM.createPortal(content, getRootPopup())}</>;
});
export default DelDialog;
