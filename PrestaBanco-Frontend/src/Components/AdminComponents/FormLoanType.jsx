import React, { useState, useEffect } from 'react';
import loanService from "../../Services/loan.service";

export default function FormLoanType() {
    const validRequirements = [
        "Comprobante de ingresos",
        "Certificado de avaluo",
        "Historial Crediticio",
        "Escritura de la primera vivienda",
        "Estado financiero del negocio",
        "Plan de negocios",
        "Presupuesto de remodelación"
    ];

    const [formData, setFormData] = useState({
        nameLoan: '',
        maxTime: '',
        minInterest: '',
        maxInterest: '',
        maxFinanPorcent: '',
        requirements: [],
    });

    // Log formData to the console whenever it changes
    useEffect(() => {
        console.log(formData);
    }, [formData]);

    const handleChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prevState => {
            const newRequirements = checked
                ? [...prevState.requirements, name]
                : prevState.requirements.filter(req => req !== name);
            return { ...prevState, requirements: newRequirements };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.requirements.length === 0) {
            alert('Debe seleccionar al menos un requisito.');
            return;
        }

        const loanType = {
            nameLoan: formData.nameLoan,
            maxTime: parseInt(formData.maxTime),
            minInterest: parseFloat(formData.minInterest),
            maxInterest: parseFloat(formData.maxInterest),
            maxFinanPorcent: parseFloat(formData.maxFinanPorcent),
            requirements: formData.requirements,
        };

        try {
            // Llamar al loanService para crear un nuevo LoanType
            await loanService.createLoan(loanType);
            alert('Loan Type created successfully');
            // Resetear el formulario
            setFormData({
                nameLoan: '',
                maxTime: '',
                minInterest: '',
                maxInterest: '',
                maxFinanPorcent: '',
                requirements: [],
            });
        } catch (error) {
            console.error('Error creating loan type:', error);
            alert('Failed to create loan type');
        }
    };

    return (
        <div className='text-black w-full h-full p-4'>
            <form onSubmit={handleSubmit} className='w-1/2 mx-auto bg-white p-6 rounded-lg shadow-lg'>
                <div className='w-full h-full'>
                    <label htmlFor="nameLoan" className="block text-sm font-medium text-gray-700">Nombre del prestamo</label>
                    <input
                        type="text"
                        id="nameLoan"
                        name="nameLoan"
                        value={formData.nameLoan}
                        onChange={e => setFormData({ ...formData, nameLoan: e.target.value })}
                        required
                        className="mt-2 w-full px-4 py-2 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label htmlFor="maxTime" className="block text-sm font-medium text-gray-700">Tiempo máximo del préstamo (años)</label>
                    <input
                        type="number"
                        id="maxTime"
                        name="maxTime"
                        value={formData.maxTime}
                        onChange={e => setFormData({ ...formData, maxTime: e.target.value })}
                        required
                        className="mt-2 bg-white w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label htmlFor="minInterest" className="block text-sm font-medium text-gray-700">Interés mínimo (incluya el punto ejemplo 3.0)</label>
                    <input
                        type="number"
                        id="minInterest"
                        name="minInterest"
                        value={formData.minInterest}
                        onChange={e => setFormData({ ...formData, minInterest: e.target.value })}
                        required
                        step="0.01"
                        className="mt-2 bg-white w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label htmlFor="maxInterest" className="block text-sm font-medium text-gray-700">Interés máximo (incluya el punto ejemplo 5.0)</label>
                    <input
                        type="number"
                        id="maxInterest"
                        name="maxInterest"
                        value={formData.maxInterest}
                        onChange={e => setFormData({ ...formData, maxInterest: e.target.value })}
                        required
                        step="0.01"
                        className="mt-2 bg-white w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label htmlFor="maxFinanPorcent" className="block text-sm font-medium text-gray-700">Máximo porcentaje de financiamiento (incluya el punto ejemplo 80.0)</label>
                    <input
                        type="number"
                        id="maxFinanPorcent"
                        name="maxFinanPorcent"
                        value={formData.maxFinanPorcent}
                        onChange={e => setFormData({ ...formData, maxFinanPorcent: e.target.value })}
                        required
                        step="0.01"
                        className="mt-2 bg-white w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Requerimientos</label>
                    <div className="mt-2 space-y-2">
                        {validRequirements.map(req => (
                            <div key={req} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={req}
                                    name={req}
                                    checked={formData.requirements.includes(req)}
                                    onChange={handleChange}
                                    className="mr-2 bg-white h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label htmlFor={req} className="text-sm text-gray-700">{req}</label>
                            </div>
                        ))}
                    </div>
                </div>

                <button type="submit" className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    Crear Prestamo
                </button>
            </form>
        </div>
    );
}
