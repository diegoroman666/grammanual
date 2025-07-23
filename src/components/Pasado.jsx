import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { Link } from 'react-router-dom';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Font Awesome Imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faCheck, faRedo, faTimes } from '@fortawesome/free-solid-svg-icons';

const Pasado = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);

  // States for EXAMPLE editing
  const [editingExampleRowId, setEditingExampleRowId] = useState(null);
  const [editedExample, setEditedExample] = useState('');

  // States for TRANSLATION editing
  const [editingTranslationRowId, setEditingTranslationRowId] = useState(null);
  const [editedTranslation, setEditedTranslation] = useState('');

  useEffect(() => {
    fetch('/estructura.xlsx')
      .then((res) => res.arrayBuffer())
      .then((ab) => {
        const wb = XLSX.read(ab, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 });

        const headers = jsonData[0];
        const rows = jsonData.slice(1).map((row, index) => {
          const obj = {};
          headers.forEach((header, i) => {
            obj[header?.toLowerCase()?.trim()] = row[i];
          });
          obj.id = index; // Add a unique ID to each row
          return obj;
        });

        const filtrado = rows.filter((r) => r['tiempo']?.toLowerCase()?.trim() === 'pasado');
        setData(filtrado);
        setOriginalData(JSON.parse(JSON.stringify(filtrado))); // Deep copy for reset functionality
      });
  }, []);

  // Function to download as Excel
  const handleDownloadExcel = () => {
    const dataToExport = data.map(row => ({
      Tiempo: row['tiempo'],
      Conjugación: row['conjugacion'],
      'Tipo de oración': row['tipo de oracion'],
      Fórmula: row['formula'],
      Ejemplo: row['ejemplo'],
      Traducción: row['traduccion'],
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `tiempo_pasado_${new Date().toLocaleDateString()}.xlsx`);
  };

  // Function to download as PDF
  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    
    const tableColumn = ["Tiempo", "Conjugación", "Tipo de oración", "Fórmula", "Ejemplo", "Traducción"];
    
    const tableRows = data.map(row => [
      row['tiempo'],
      row['conjugacion'],
      row['tipo de oracion'],
      row['formula'],
      row['ejemplo'],
      row['traduccion']
    ]);

    doc.setFontSize(18);
    doc.text("Tabla del Tiempo Pasado", 14, 20);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: {
        fontSize: 10,
        cellPadding: 2,
        halign: 'center'
      },
      headStyles: {
        fillColor: '#E9ECEF',
        textColor: '#495057',
        fontStyle: 'bold'
      },
      bodyStyles: {
        textColor: '#343A40'
      },
      alternateRowStyles: {
        fillColor: '#F8F9FA'
      }
    });

    doc.save(`tiempo_pasado_${new Date().toLocaleDateString()}.pdf`);
  };

  // --- Functions for EXAMPLE editing ---
  const handleEditExampleClick = (id, currentExample) => {
    setEditingExampleRowId(id);
    setEditedExample(currentExample);
    // Ensure translation editing is cancelled if active for this row
    if (editingTranslationRowId === id) {
      setEditingTranslationRowId(null);
      setEditedTranslation('');
    }
  };

  const handleSaveExampleEdit = (id) => {
    setData((prevData) =>
      prevData.map((row) =>
        row.id === id ? { ...row, ejemplo: editedExample } : row
      )
    );
    setEditingExampleRowId(null);
    setEditedExample('');
  };

  const handleCancelExampleEdit = () => {
    setEditingExampleRowId(null);
    setEditedExample('');
  };

  const handleResetExampleText = (id) => {
    setData((prevData) =>
      prevData.map((row) =>
        row.id === id
          ? { ...row, ejemplo: originalData.find(orig => orig.id === id)?.ejemplo }
          : row
      )
    );
    if (editingExampleRowId === id) {
      setEditingExampleRowId(null);
      setEditedExample('');
    }
  };

  const handleExampleChange = (e) => {
    setEditedExample(e.target.value);
  };

  const handleExampleKeyPress = (e, id) => {
    if (e.key === 'Enter') {
      handleSaveExampleEdit(id);
    }
  };

  // --- Functions for TRANSLATION editing ---
  const handleEditTranslationClick = (id, currentTranslation) => {
    setEditingTranslationRowId(id);
    setEditedTranslation(currentTranslation);
    // Ensure example editing is cancelled if active for this row
    if (editingExampleRowId === id) {
      setEditingExampleRowId(null);
      setEditedExample('');
    }
  };

  const handleSaveTranslationEdit = (id) => {
    setData((prevData) =>
      prevData.map((row) =>
        row.id === id ? { ...row, traduccion: editedTranslation } : row
      )
    );
    setEditingTranslationRowId(null);
    setEditedTranslation('');
  };

  const handleCancelTranslationEdit = () => {
    setEditingTranslationRowId(null);
    setEditedTranslation('');
  };

  const handleResetTranslationText = (id) => {
    setData((prevData) =>
      prevData.map((row) =>
        row.id === id
          ? { ...row, traduccion: originalData.find(orig => orig.id === id)?.traduccion }
          : row
      )
    );
    if (editingTranslationRowId === id) {
      setEditingTranslationRowId(null);
      setEditedTranslation('');
    }
  };

  const handleTranslationChange = (e) => {
    setEditedTranslation(e.target.value);
  };

  const handleTranslationKeyPress = (e, id) => {
    if (e.key === 'Enter') {
      handleSaveTranslationEdit(id);
    }
  };

  return (
    <div className="container mt-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-xl font-weight-bold">Tabla del Tiempo Pasado</h2>
        <div className="d-flex gap-2">
          <Link to="/" className="btn btn-primary">
            Volver al Home
          </Link>
          <button onClick={handleDownloadExcel} className="btn btn-success">
            Descargar Excel
          </button>
          <button onClick={handleDownloadPdf} className="btn btn-danger">
            Descargar PDF
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead>
            <tr className="bg-light">
              <th scope="col">Tiempo</th>
              <th scope="col">Conjugación</th>
              <th scope="col">Tipo de oración</th>
              <th scope="col">Fórmula</th>
              <th scope="col">Ejemplo</th>
              <th scope="col">Acciones Ejemplo</th> {/* New column for Example actions */}
              <th scope="col">Traducción</th>
              <th scope="col">Acciones Traducción</th> {/* New column for Translation actions */}
            </tr>
          </thead>
          <tbody>
            {data.map((fila) => (
              <tr key={fila.id}>
                <td>{fila['tiempo']}</td>
                <td>{fila['conjugacion']}</td>
                <td>{fila['tipo de oracion']}</td>
                <td>{fila['formula']}</td>
                
                {/* Example Cell: Conditionally editable */}
                <td>
                  {editingExampleRowId === fila.id ? (
                    <input
                      type="text"
                      className="form-control"
                      value={editedExample}
                      onChange={handleExampleChange}
                      onKeyPress={(e) => handleExampleKeyPress(e, fila.id)}
                      autoFocus={editingExampleRowId === fila.id}
                    />
                  ) : (
                    fila['ejemplo']
                  )}
                </td>
                {/* Actions for Example */}
                <td>
                  {editingExampleRowId === fila.id ? (
                    <>
                      <button
                        className="btn btn-sm btn-success me-2"
                        onClick={() => handleSaveExampleEdit(fila.id)}
                      >
                        <FontAwesomeIcon icon={faCheck} /> {/* Check icon */}
                      </button>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={handleCancelExampleEdit}
                      >
                        <FontAwesomeIcon icon={faTimes} /> {/* Times icon */}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-sm btn-info me-2"
                        onClick={() => handleEditExampleClick(fila.id, fila['ejemplo'])}
                      >
                        <FontAwesomeIcon icon={faPencilAlt} /> {/* Pencil icon */}
                      </button>
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => handleResetExampleText(fila.id)}
                      >
                        <FontAwesomeIcon icon={faRedo} /> {/* Redo icon */}
                      </button>
                    </>
                  )}
                </td>

                {/* Translation Cell: Conditionally editable */}
                <td>
                  {editingTranslationRowId === fila.id ? (
                    <input
                      type="text"
                      className="form-control"
                      value={editedTranslation}
                      onChange={handleTranslationChange}
                      onKeyPress={(e) => handleTranslationKeyPress(e, fila.id)}
                      autoFocus={editingTranslationRowId === fila.id}
                    />
                  ) : (
                    fila['traduccion']
                  )}
                </td>
                {/* Actions for Translation */}
                <td>
                  {editingTranslationRowId === fila.id ? (
                    <>
                      <button
                        className="btn btn-sm btn-success me-2"
                        onClick={() => handleSaveTranslationEdit(fila.id)}
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </button>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={handleCancelTranslationEdit}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-sm btn-info me-2"
                        onClick={() => handleEditTranslationClick(fila.id, fila['traduccion'])}
                      >
                        <FontAwesomeIcon icon={faPencilAlt} />
                      </button>
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => handleResetTranslationText(fila.id)}
                      >
                        <FontAwesomeIcon icon={faRedo} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Pasado;
