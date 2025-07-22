import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { Link } from 'react-router-dom';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf'; // Importa jspdf
import 'jspdf-autotable'; // Importa jspdf-autotable

const Pasado = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/estructura.xlsx')
      .then((res) => res.arrayBuffer())
      .then((ab) => {
        const wb = XLSX.read(ab, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 });

        const headers = jsonData[0];
        const rows = jsonData.slice(1).map((row) => {
          const obj = {};
          headers.forEach((header, i) => {
            obj[header?.toLowerCase()?.trim()] = row[i];
          });
          return obj;
        });

        const filtrado = rows.filter((r) => r['tiempo']?.toLowerCase()?.trim() === 'pasado');
        setData(filtrado);
      });
  }, []);

  // Función para descargar como Excel
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

  // Función para descargar como PDF
  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    const tableColumn = ["Tiempo", "Conjugación", "Tipo de oración", "Fórmula", "Ejemplo", "Traducción"];
    const tableRows = [];

    data.forEach(row => {
      const rowData = [
        row['tiempo'],
        row['conjugacion'],
        row['tipo de oracion'],
        row['formula'],
        row['ejemplo'],
        row['traduccion']
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20, // Comienza la tabla un poco más abajo
      didDrawPage: function(data) {
        // Encabezado del documento
        doc.setFontSize(16);
        doc.text("Tabla del Tiempo Pasado", data.settings.margin.left, 15);
      }
    });
    doc.save(`tiempo_pasado_${new Date().toLocaleDateString()}.pdf`);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-xl font-weight-bold">Tabla del Tiempo Pasado</h2>
        <div className="d-flex gap-2"> {/* Contenedor para los botones con un pequeño espacio */}
          <Link to="/" className="btn btn-primary">
            Volver al Home
          </Link>
          <button onClick={handleDownloadExcel} className="btn btn-success">
            Descargar Excel
          </button>
          <button onClick={handleDownloadPdf} className="btn btn-danger"> {/* Botón para PDF, color rojo */}
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
              <th scope="col">Traducción</th>
            </tr>
          </thead>
          <tbody>
            {data.map((fila, i) => (
              <tr key={i}>
                <td>{fila['tiempo']}</td>
                <td>{fila['conjugacion']}</td>
                <td>{fila['tipo de oracion']}</td>
                <td>{fila['formula']}</td>
                <td>{fila['ejemplo']}</td>
                <td>{fila['traduccion']}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Pasado;