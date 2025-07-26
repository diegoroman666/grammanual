// src/components/Futuro.jsx
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { Link } from 'react-router-dom';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faCheck, faRedo, faTimes } from '@fortawesome/free-solid-svg-icons';
import '../styles/pro-theme.css';
import { translateText } from '../services/translateApi';

const groupByConjugation = (rows) => {
  const groups = {};
  rows.forEach((row) => {
    const conjug = row['conjugacion']?.toLowerCase();
    if (!groups[conjug]) groups[conjug] = [];
    groups[conjug].push(row);
  });
  return groups;
};

const Futuro = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [editingExampleRowId, setEditingExampleRowId] = useState(null);
  const [editedExample, setEditedExample] = useState('');
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
          obj.id = index;
          return obj;
        });

        const filtrado = rows.filter((r) => r['tiempo']?.toLowerCase()?.trim() === 'futuro');
        setData(filtrado);
        setOriginalData(JSON.parse(JSON.stringify(filtrado)));
      });
  }, []);

  const handleDownloadExcel = () => {
    const dataToExport = data.map(row => ({
      'Tipo de oración': row['tipo de oracion'],
      Fórmula: row['formula'],
      Ejemplo: row['ejemplo'],
      Traducción: row['traduccion'],
    }));
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `tiempo_futuro_${new Date().toLocaleDateString()}.xlsx`);
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    const tableColumn = ["Tipo de oración", "Fórmula", "Ejemplo", "Traducción"];
    const tableRows = data.map(row => [
      row['tipo de oracion'],
      row['formula'],
      row['ejemplo'],
      row['traduccion']
    ]);
    doc.setFontSize(18);
    doc.text("Tabla del Tiempo Futuro", 14, 20);
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { fontSize: 9, cellPadding: 2, halign: 'center' },
      headStyles: { fillColor: '#E9ECEF', textColor: '#495057', fontStyle: 'bold' },
      bodyStyles: { textColor: '#343A40' },
      alternateRowStyles: { fillColor: '#F8F9FA' }
    });
    doc.save(`tiempo_futuro_${new Date().toLocaleDateString()}.pdf`);
  };

  const handleEditExampleClick = (id, currentExample) => {
    setEditingExampleRowId(id);
    setEditedExample(currentExample);
    if (editingTranslationRowId === id) {
      setEditingTranslationRowId(null);
      setEditedTranslation('');
    }
  };

  const handleSaveExampleEdit = (id) => {
    const updatedData = data.map((rowItem) =>
      rowItem.id === id ? { ...rowItem, ejemplo: editedExample } : rowItem
    );
    setData(updatedData);
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

  const handleExampleChange = async (e) => {
    const value = e.target.value;
    setEditedExample(value);

    // Traducción automática
    const translation = await translateText(value);
    setData((prevData) =>
      prevData.map((row) =>
        row.id === editingExampleRowId
          ? { ...row, traduccion: translation }
          : row
      )
    );
  };

  const handleEditTranslationClick = (id, currentTranslation) => {
    setEditingTranslationRowId(id);
    setEditedTranslation(currentTranslation);
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

  const handleTranslationChange = (e) => setEditedTranslation(e.target.value);

  const grouped = groupByConjugation(data);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Tabla del Tiempo Futuro</h2>
        <div className="d-flex gap-2">
          <Link to="/" className="btn btn-primary">Volver al Home</Link>
          <button onClick={handleDownloadExcel} className="btn btn-success">Descargar Excel</button>
          <button onClick={handleDownloadPdf} className="btn btn-danger">Descargar PDF</button>
        </div>
      </div>

      {Object.keys(grouped).map((conjug) => (
        <div key={conjug}>
          <div className="section-header">
            Conjugación: {conjug.toUpperCase()}
          </div>
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>Tipo de oración</th>
                  <th>Fórmula</th>
                  <th>Ejemplo</th>
                  <th>Acciones Ejemplo</th>
                  <th>Traducción</th>
                  <th>Acciones Traducción</th>
                </tr>
              </thead>
              <tbody>
                {grouped[conjug].map((fila) => (
                  <tr key={fila.id}>
                    <td>{fila['tipo de oracion']}</td>
                    <td>{fila['formula']}</td>
                    <td>
                      {editingExampleRowId === fila.id ? (
                        <input
                          type="text"
                          className="form-control"
                          value={editedExample}
                          onChange={handleExampleChange}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleSaveExampleEdit(fila.id); }}
                          autoFocus={editingExampleRowId === fila.id}
                        />
                      ) : (
                        fila['ejemplo']
                      )}
                    </td>
                    <td>
                      {editingExampleRowId === fila.id ? (
                        <>
                          <button className="btn btn-sm btn-success me-2" onClick={() => handleSaveExampleEdit(fila.id)}>
                            <FontAwesomeIcon icon={faCheck} />
                          </button>
                          <button className="btn btn-sm btn-secondary" onClick={handleCancelExampleEdit}>
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="btn btn-sm btn-info me-2" onClick={() => handleEditExampleClick(fila.id, fila['ejemplo'])}>
                            <FontAwesomeIcon icon={faPencilAlt} />
                          </button>
                          <button className="btn btn-sm btn-warning" onClick={() => handleResetExampleText(fila.id)}>
                            <FontAwesomeIcon icon={faRedo} />
                          </button>
                        </>
                      )}
                    </td>
                    <td>
                      {editingTranslationRowId === fila.id ? (
                        <input
                          type="text"
                          className="form-control"
                          value={editedTranslation}
                          onChange={handleTranslationChange}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleSaveTranslationEdit(fila.id); }}
                          autoFocus={editingTranslationRowId === fila.id}
                        />
                      ) : (
                        fila['traduccion']
                      )}
                    </td>
                    <td>
                      {editingTranslationRowId === fila.id ? (
                        <>
                          <button className="btn btn-sm btn-success me-2" onClick={() => handleSaveTranslationEdit(fila.id)}>
                            <FontAwesomeIcon icon={faCheck} />
                          </button>
                          <button className="btn btn-sm btn-secondary" onClick={handleCancelTranslationEdit}>
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="btn btn-sm btn-info me-2" onClick={() => handleEditTranslationClick(fila.id, fila['traduccion'])}>
                            <FontAwesomeIcon icon={faPencilAlt} />
                          </button>
                          <button className="btn btn-sm btn-warning" onClick={() => handleResetTranslationText(fila.id)}>
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
      ))}
    </div>
  );
};

export default Futuro;
