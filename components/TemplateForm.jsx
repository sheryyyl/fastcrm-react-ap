import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TemplateForm = () => {
  const [form, setForm] = useState({ type: '', content: '', labels: '', author: '' });
  const [editingId, setEditingId] = useState(null);
  const [templates, setTemplates] = useState([]);

  // Cargar las plantillas al montar el componente
  useEffect(() => {
    fetchTemplates();
  }, []);

  // Obtener todas las plantillas
  const fetchTemplates = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/templates`);
      setTemplates(response.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  // Manejar el envío del formulario (crear o actualizar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/templates/${editingId}`, {
          ...form,
          labels: form.labels.split(',').map((label) => label.trim()),
        });
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/templates`, {
          ...form,
          labels: form.labels.split(',').map((label) => label.trim()),
        });
      }
      setForm({ type: '', content: '', labels: '', author: '' });
      setEditingId(null);
      fetchTemplates();
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  // Manejar la edición de una plantilla
  const handleEdit = (template) => {
    setForm({
      type: template.type,
      content: template.content,
      labels: template.labels.join(', '),
      author: template.author,
    });
    setEditingId(template._id);
  };

  // Manejar la eliminación de una plantilla
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/templates/${id}`);
      fetchTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center font-sans px-4 py-8">
  <div className="w-full max-w-lg bg-white border border-gray-200 shadow-md rounded-lg p-6">
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        {editingId ? 'Edit Template' : 'Create Template'}
      </h2>

      <div className="mb-5">
        <label className="block text-gray-700 font-medium mb-1">Type:</label>
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          required
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 font-medium mb-1">Content:</label>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 font-medium mb-1">Labels (comma-separated):</label>
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={form.labels}
          onChange={(e) => setForm({ ...form, labels: e.target.value })}
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-1">Author:</label>
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
          required
        />
      </div>

      <div className="text-center">
        <button
          type="submit"
          className="bg-blue-500 text-white font-medium py-3 px-6 rounded-md hover:bg-blue-600 transition duration-200"
        >
          {editingId ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  </div>

  {/* Existing Templates fuera del card */}
  <div className="w-full max-w-lg mt-10">
    <h3 className="text-xl font-bold text-gray-800 mb-4">Existing Templates</h3>
    <ul className="space-y-4">
      {templates.map((template) => (
        <li
          key={template._id}
          className="p-4 bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <strong className="block text-gray-800">{template.type}</strong>
          <p className="text-gray-600">{template.content}</p>
          <small className="block text-gray-500">
            Labels: {template.labels.join(', ')}
          </small>
          <small className="block text-gray-500">Author: {template.author}</small>
          <div className="mt-2 flex space-x-2">
            <button
              onClick={() => handleEdit(template)}
              className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition duration-200"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(template._id)}
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-200"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  </div>
</div>

  );
};

export default TemplateForm;