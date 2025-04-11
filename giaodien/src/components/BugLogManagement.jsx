import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BugLogManagement = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/buglogs`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setLogs(response.data);
        } catch (error) {
            console.error('Error fetching bug logs:', error.message);
            setError('Unable to load bug logs');
        } finally {
            setLoading(false);
        }
    };

    const deleteLog = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${import.meta.env.VITE_API_URL}/buglogs/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setLogs(logs.filter((log) => log._id !== id));
        } catch (error) {
            console.error('Error deleting bug log:', error.message);
            alert('Unable to delete bug log');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-2xl font-bold mb-4">Bug Logs</h1>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <table className="w-full bg-white shadow rounded-lg">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Message</th>
                            <th className="px-4 py-2">Endpoint</th>
                            <th className="px-4 py-2">Method</th>
                            <th className="px-4 py-2">Status Code</th>
                            <th className="px-4 py-2">Date</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log) => (
                            <tr key={log._id}>
                                <td className="px-4 py-2">{log.message}</td>
                                <td className="px-4 py-2">{log.endpoint}</td>
                                <td className="px-4 py-2">{log.method}</td>
                                <td className="px-4 py-2">{log.statusCode}</td>
                                <td className="px-4 py-2">{new Date(log.createdAt).toLocaleString()}</td>
                                <td className="px-4 py-2">
                                    <button
                                        className="bg-red-500 text-white px-4 py-2 rounded"
                                        onClick={() => deleteLog(log._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default BugLogManagement;