import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { Link } from 'react-router-dom'; // Importa Link para el botón "Volver al Home"

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
            // Asegúrate de que los encabezados se manejen de forma segura
            obj[header?.toLowerCase()?.trim()] = row[i];
          });
          return obj;
        });

        // Filtra por TIEMPO PASADO
        const filtrado = rows.filter((r) => r['tiempo']?.toLowerCase()?.trim() === 'pasado');
        setData(filtrado);
      });
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4"> {/* Contenedor para título y botón */}
        <h2 className="text-xl font-bold">Tabla del Tiempo Pasado</h2>
        <Link to="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Volver al Home
        </Link>
      </div>

      <table className="table-auto w-full border border-gray-500">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Tiempo</th> {/* Añadido de vuelta 'Tiempo' */}
            <th className="border p-2">Conjugación</th>
            <th className="border p-2">Tipo de oración</th> {/* Cambiado de 'Tipo' a 'Tipo de oración' para coincidir con el excel */}
            <th className="border p-2">Fórmula</th>
            <th className="border p-2">Ejemplo</th>
            <th className="border p-2">Traducción</th>
            {/* ELIMINADA: <th className="border p-2">Traducción alternativa</th> */}
          </tr>
        </thead>
        <tbody>
          {data.map((fila, i) => (
            <tr key={i}>
              <td className="border p-2">{fila['tiempo']}</td> {/* Añadido de vuelta el campo 'Tiempo' */}
              <td className="border p-2">{fila['conjugacion']}</td>
              <td className="border p-2">{fila['tipo de oracion']}</td>
              <td className="border p-2">{fila['formula']}</td>
              <td className="border p-2">{fila['ejemplo']}</td>
              <td className="border p-2">{fila['traduccion']}</td>
              {/* ELIMINADA: <td className="border p-2">{fila['traduccion alternativa']}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Pasado;