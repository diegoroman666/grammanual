// src/components/Herramientas.jsx
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPencilAlt, faCheck, faRedo, faTimes, faToolbox,
  faBackward, faPlay, faForward, faFileExcel, faFilePdf,
} from '@fortawesome/free-solid-svg-icons';
import './Herramientas.css';
import '../styles/pro-theme.css';
import { translateText } from '../services/translateApi';

const TENSES = [
  { id: 'pasado',   label: 'Pasado',   icon: faBackward },
  { id: 'presente', label: 'Presente', icon: faPlay },
  { id: 'futuro',   label: 'Futuro',   icon: faForward },
];

const groupByConjugation = (rows) => {
  const groups = {};
  rows.forEach((row) => {
    const conjug = row['conjugacion']?.toLowerCase();
    if (!groups[conjug]) groups[conjug] = [];
    groups[conjug].push(row);
  });
  return groups;
};

const Herramientas = () => {
  const [tense, setTense] = useState('pasado');
  const [allRows, setAllRows] = useState([]);
  const [originalRows, setOriginalRows] = useState([]);
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

        setAllRows(rows);
        setOriginalRows(JSON.parse(JSON.stringify(rows)));
      });
  }, []);

  const data = allRows.filter((r) => r['tiempo']?.toLowerCase()?.trim() === tense);

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
    saveAs(blob, `tiempo_${tense}_${new Date().toLocaleDateString()}.xlsx`);
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
    const tenseLabel = TENSES.find(t => t.id === tense)?.label || tense;
    doc.setFontSize(18);
    doc.text(`Tabla del Tiempo ${tenseLabel}`, 14, 20);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { fontSize: 9, cellPadding: 2, halign: 'center' },
      headStyles: { fillColor: '#E9ECEF', textColor: '#495057', fontStyle: 'bold' },
      bodyStyles: { textColor: '#343A40' },
      alternateRowStyles: { fillColor: '#F8F9FA' }
    });
    doc.save(`tiempo_${tense}_${new Date().toLocaleDateString()}.pdf`);
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
    setAllRows((prev) => prev.map((row) => row.id === id ? { ...row, ejemplo: editedExample } : row));
    setEditingExampleRowId(null);
    setEditedExample('');
  };

  const handleCancelExampleEdit = () => {
    setEditingExampleRowId(null);
    setEditedExample('');
  };

  const handleResetExampleText = (id) => {
    setAllRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? { ...row, ejemplo: originalRows.find(orig => orig.id === id)?.ejemplo }
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

    const translation = await translateText(value);
    setAllRows((prev) =>
      prev.map((row) =>
        row.id === editingExampleRowId ? { ...row, traduccion: translation } : row
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
    setAllRows((prev) => prev.map((row) => row.id === id ? { ...row, traduccion: editedTranslation } : row));
    setEditingTranslationRowId(null);
    setEditedTranslation('');
  };

  const handleCancelTranslationEdit = () => {
    setEditingTranslationRowId(null);
    setEditedTranslation('');
  };

  const handleResetTranslationText = (id) => {
    setAllRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? { ...row, traduccion: originalRows.find(orig => orig.id === id)?.traduccion }
          : row
      )
    );
    if (editingTranslationRowId === id) {
      setEditingTranslationRowId(null);
      setEditedTranslation('');
    }
  };

  const handleTranslationChange = async (e) => {
    const value = e.target.value;
    setEditedTranslation(value);

    const translation = await translateText(value, 'es|en');
    setAllRows((prev) =>
      prev.map((row) =>
        row.id === editingTranslationRowId ? { ...row, ejemplo: translation } : row
      )
    );
  };

  const grouped = groupByConjugation(data);

  return (
    <div className="herramientas-container mt-4">
      <div className="herramientas-header">
        <h1><FontAwesomeIcon icon={faToolbox} /> Herramientas de Fórmulas</h1>
        <p>Consulta, edita y exporta las fórmulas gramaticales de cada tiempo verbal</p>
      </div>

      <div className="herramientas-tabs">
        {TENSES.map(t => (
          <button
            key={t.id}
            className={`herramientas-tab ${tense === t.id ? 'active' : ''}`}
            onClick={() => setTense(t.id)}
          >
            <FontAwesomeIcon icon={t.icon} /> {t.label}
          </button>
        ))}
      </div>

      <div className="herramientas-actions">
        <button onClick={handleDownloadExcel} className="btn btn-success">
          <FontAwesomeIcon icon={faFileExcel} /> Descargar Excel
        </button>
        <button onClick={handleDownloadPdf} className="btn btn-danger">
          <FontAwesomeIcon icon={faFilePdf} /> Descargar PDF
        </button>
      </div>

      {Object.keys(grouped).map((conjug) => (
        <div key={conjug}>
          <div className="section-header">
            Conjugación: {conjug.toUpperCase()}
          </div>
          <div className="table-responsive">
            <table className="table table-bordered table-hover herramientas-table">
              <thead>
                <tr>
                  <th className="col-tipo">Tipo de oración</th>
                  <th className="col-formula">Fórmula</th>
                  <th className="col-ejemplo">Ejemplo (inglés)</th>
                  <th className="col-traduccion">Traducción (español)</th>
                </tr>
              </thead>
              <tbody>
                {grouped[conjug].map((fila) => (
                  <tr key={fila.id}>
                    <td data-label="Tipo de oración">{fila['tipo de oracion']}</td>
                    <td data-label="Fórmula">{fila['formula']}</td>
                    <td data-label="Ejemplo (inglés)">
                      {editingExampleRowId === fila.id ? (
                        <div className="cell-edit-row">
                          <input
                            type="text"
                            className="form-control"
                            value={editedExample}
                            onChange={handleExampleChange}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSaveExampleEdit(fila.id); }}
                            autoFocus={editingExampleRowId === fila.id}
                          />
                          <button className="icon-btn-sm icon-btn-success" onClick={() => handleSaveExampleEdit(fila.id)} title="Guardar">
                            <FontAwesomeIcon icon={faCheck} />
                          </button>
                          <button className="icon-btn-sm icon-btn-secondary" onClick={handleCancelExampleEdit} title="Cancelar">
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </div>
                      ) : (
                        <div className="cell-view-row">
                          <span className="cell-text">{fila['ejemplo']}</span>
                          <span className="cell-actions">
                            <button className="icon-btn-sm icon-btn-info" onClick={() => handleEditExampleClick(fila.id, fila['ejemplo'])} title="Editar">
                              <FontAwesomeIcon icon={faPencilAlt} />
                            </button>
                            <button className="icon-btn-sm icon-btn-warning" onClick={() => handleResetExampleText(fila.id)} title="Restablecer">
                              <FontAwesomeIcon icon={faRedo} />
                            </button>
                          </span>
                        </div>
                      )}
                    </td>
                    <td data-label="Traducción (español)">
                      {editingTranslationRowId === fila.id ? (
                        <div className="cell-edit-row">
                          <input
                            type="text"
                            className="form-control"
                            value={editedTranslation}
                            onChange={handleTranslationChange}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSaveTranslationEdit(fila.id); }}
                            autoFocus={editingTranslationRowId === fila.id}
                          />
                          <button className="icon-btn-sm icon-btn-success" onClick={() => handleSaveTranslationEdit(fila.id)} title="Guardar">
                            <FontAwesomeIcon icon={faCheck} />
                          </button>
                          <button className="icon-btn-sm icon-btn-secondary" onClick={handleCancelTranslationEdit} title="Cancelar">
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </div>
                      ) : (
                        <div className="cell-view-row">
                          <span className="cell-text">{fila['traduccion']}</span>
                          <span className="cell-actions">
                            <button className="icon-btn-sm icon-btn-info" onClick={() => handleEditTranslationClick(fila.id, fila['traduccion'])} title="Editar">
                              <FontAwesomeIcon icon={faPencilAlt} />
                            </button>
                            <button className="icon-btn-sm icon-btn-warning" onClick={() => handleResetTranslationText(fila.id)} title="Restablecer">
                              <FontAwesomeIcon icon={faRedo} />
                            </button>
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
      {data.length === 0 && (
        <p className="herramientas-empty">No hay datos para el tiempo seleccionado.</p>
      )}
    </div>
  );
};

export default Herramientas;
