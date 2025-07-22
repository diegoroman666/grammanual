import React, { useEffect, useRef } from 'react';
// Importamos la clase Modal de Bootstrap para controlarla programáticamente
import { Modal as BSModal } from 'bootstrap';

const Modal = ({ visible, onClose, title, children }) => {
  const modalRef = useRef(null); // Referencia al elemento DOM del modal
  const bsModalInstance = useRef(null); // Para almacenar la instancia del Modal de Bootstrap

  useEffect(() => {
    if (!modalRef.current) return;

    // Inicializar el modal de Bootstrap solo una vez
    if (!bsModalInstance.current) {
      bsModalInstance.current = new BSModal(modalRef.current);

      // Limpiar al desmontar el componente para evitar fugas de memoria
      return () => {
        if (bsModalInstance.current) {
          bsModalInstance.current.dispose();
          bsModalInstance.current = null;
        }
      };
    }
  }, []); // El array vacío asegura que se ejecute solo una vez al montar

  useEffect(() => {
    if (bsModalInstance.current) {
      if (visible) {
        bsModalInstance.current.show();
      } else {
        bsModalInstance.current.hide();
      }
    }
  }, [visible]); // Se ejecuta cada vez que 'visible' cambia

  // Para asegurar que el estado de React se actualice cuando el modal se cierra por
  // otras vías (ej. clic fuera del modal si se configura así, o tecla ESC)
  useEffect(() => {
    const modalElement = modalRef.current;
    if (modalElement) {
      const handleHidden = () => {
        // Asegurarse de que onClose solo se llama si el modal estaba visible
        // y ha sido ocultado por Bootstrap, para evitar bucles.
        if (visible) {
          onClose();
        }
      };
      modalElement.addEventListener('hidden.bs.modal', handleHidden);

      return () => {
        modalElement.removeEventListener('hidden.bs.modal', handleHidden);
      };
    }
  }, [onClose, visible]); // Depende de onClose y visible para re-establecer el listener

  // El modal de Bootstrap no se renderiza condicionalmente con React
  // directamente en el return. Su visibilidad es controlada por JS.
  // Siempre está en el DOM pero su display se alterna.

  return (
    // Estructura básica de un modal de Bootstrap
    <div
      className="modal fade" // 'fade' para animación, 'modal' es la clase base
      id="gramManualModal" // ID único para referencia
      tabIndex="-1"
      aria-labelledby="gramManualModalLabel"
      aria-hidden="true"
      ref={modalRef} // Asignamos nuestra referencia al div del modal
    >
      <div className="modal-dialog modal-dialog-centered"> {/* 'modal-dialog-centered' centra el modal */}
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="gramManualModalLabel">{title}</h5>
            <button
              type="button"
              className="btn-close" // Clase de Bootstrap para el botón de cerrar
              data-bs-dismiss="modal" // Atributo para que Bootstrap lo cierre
              aria-label="Cerrar"
              onClick={onClose} // También llamamos a nuestro propio onClose
            ></button>
          </div>
          <div className="modal-body">
            {children} {/* Contenido dinámico (feedback de la IA) */}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary" // Clase de Bootstrap para botón secundario
              data-bs-dismiss="modal"
              onClick={onClose} // También llamamos a nuestro propio onClose
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;