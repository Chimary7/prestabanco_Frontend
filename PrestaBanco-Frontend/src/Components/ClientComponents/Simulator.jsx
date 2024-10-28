import { useState, useEffect } from 'react';
import loanService from '../../Services/loan.service';
import calculateService from '../../Services/calculate.service';

export default function Simulator() {
    const [loanTypes, setLoanTypes] = useState([]);
    const [selectedLoanType, setSelectedLoanType] = useState(null);
    const [resultSimulator, setresultSimulator] = useState(null);
    const [amount, setAmount] = useState(null);
    const [annualInterestRate, setAnnualInterestRate] = useState(null);
    const [years, setYears] = useState(null);

    useEffect(() => {
        loanService.getAll()
            .then(response => {
                setLoanTypes(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const handleLoanTypeChange = (e) => {
        const selectedLoan = loanTypes.find(loanType => loanType.id == e.target.value);
        setSelectedLoanType(selectedLoan);
        setAnnualInterestRate(selectedLoan ? selectedLoan.minInterest : 0);
        setYears(5);
    };

    const handleInterestChange = (e) => {
        setAnnualInterestRate(e.target.value);
    };

    const handleYearsChange = (e) => {
        setYears(e.target.value);
    };

    const handleAmountChange = (e) => {
        const value = e.target.value.replace(/\./g, ''); // Remover puntos
        if (!isNaN(value)) {
            setAmount(formatNumber(value));  // Formatear para mostrar con puntos
        }
    };
    

    const formatNumber = (number) => {
        // Parseamos el número y luego lo formateamos para que el usuario vea los puntos
        return new Intl.NumberFormat('es-ES', {
            style: 'decimal',
        }).format(number);
    };
    

    const CalculateSubmit = async(e) =>{
        e.preventDefault();
        
        const unformattedAmount = amount.replace(/\./g,''); // Remover puntos

        try{
            const response = await calculateService.getCalculate(unformattedAmount,annualInterestRate,years);
            console.log(response.data);
            setresultSimulator(response.data);
        } catch (error){
            console.error('error al calcular', error);
        }
    }

    const YearOptions = () => {
        if (selectedLoanType) {
            const options = [];
            for (let i = 5; i <= selectedLoanType.maxTime; i++) {
                options.push(<option key={i} value={i}>{i} años</option>);
            }
            return options;
        }
        return null;
    };

    return(
        <div className='w-full h-full'>
            <form className='h-full w-full flex flex-col items-center p-2'onSubmit={CalculateSubmit}>
                <div className='flex w-full h-full'>
                    <div className='w-1/2 h-full p-4'>
                        <h1 className='w-full h-1/6 font-bold text-custom-blue'>Simulador de Credito</h1>
                        <div className='w-full h-1/6 p-2'>
                            <label htmlFor='loanType' className='text-custom-blue-light font-bold'>Tipo de credito</label>
                            <select 
                                name='loanType' 
                                id='loanType' 
                                onChange={handleLoanTypeChange}
                                className='w-full p-3 bg-white rounded-md border text-black border-custom-blue'>
                                <option value="">Selecciona un tipo de crédito</option>
                                {loanTypes.map(loanType => (
                                        <option key={loanType.id} value={loanType.id}>{loanType.nameLoan}</option>
                                    ))}
                            </select>
                        </div>
                        <div className='w-full h-3/6 p-2'>
                            {selectedLoanType && (
                                <div className="w-full h-full">
                                    <div className="w-full h-1/3">
                                        <label htmlFor='amount' className='text-custom-blue-light font-bold'>Monto del prestamo</label>
                                        <input 
                                            type="text"
                                            name='amount'
                                            id='amount'
                                            value={amount || ''}
                                            onChange={handleAmountChange}
                                            className='w-full p-3 bg-white rounded-md border text-black border-custom-blue'     
                                        />
                                    </div>
                                    <div className="w-full h-1/3">
                                        <label htmlFor='annualInterestRate' className='text-custom-blue-light font-bold'>Intereses</label>
                                        <input
                                            type="number"
                                            name='annualInterestRate'
                                            id='annualInterestRate'
                                            className='w-full p-3 bg-white text-black rounded-md border border-custom-blue'
                                            value={annualInterestRate}
                                            onChange={handleInterestChange}
                                            step="0.1"
                                            min={selectedLoanType.minInterest}
                                            max={selectedLoanType.maxInterest}
                                        />
                                    </div>
                                    <div className="w-full h-1/3">
                                        <label htmlFor='years' className='text-custom-blue-light font-bold'>Duración del préstamo (años)</label>
                                        <select 
                                            name='years' 
                                            id='years' 
                                            className='w-full p-3 bg-white rounded-md border border-custom-blue text-black'
                                            value={years}
                                            onChange={handleYearsChange}
                                        >
                                            {YearOptions()}
                                        </select>
                                    </div>
                                </div>
                            )}

                        </div>

                        <div className='w-full h-1/6 justify-center items-center flex'>
                            <button className="mt-4 h-4/6 w-1/2 bg-blue-700 text-white rounded" type='submit'>Simular</button>
                        </div>
                    </div>
                    <div className='w-1/2 h-full border-dotted border-l border-gray-300'>
                        <h1 className='h-1/6 flex items-center justify-center font-bold text-custom-blue-light border-b border-custom-blue-light '>resultados simulación</h1>
                        <div className='h-4/6 text-black'>
                            <div className='h-1/4 w-full flex items-center p-2'>
                                {   amount && (
                                    <div className='w-full h-full flex items-center p-6 font-bold'>
                                        <p>monto prestamo: ${amount}</p>
                                    </div>
                                )}
                            </div>
                            <div className='w-full h-1/2 p-2 bg-blue-100'>
                                { annualInterestRate && (
                                    <div className='w-full h-full flex items-center flex-col p-6'>
                                        <p className='w-full h-1/2 flex items-center font-bold'>interes anual: {annualInterestRate}%</p>
                                        <p className='w-full h-1/2 flex items-center p-8 font-medium'>interes mensual: {(annualInterestRate/12).toFixed(2)}%</p>
                                    </div>
                                )}
                            </div>
                            <div className='w-full h-1/4 flex items-center p-2'>
                                {years && (
                                    <div className='w-full h-full flex items-center p-6'>
                                        <p className='font-bold'>duracion del prestamo: {years} años</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='w-full h-1/6 border-t border-gray-400 text-black'>
                            {resultSimulator && (
                                <div className='h-full w-full p-4'>
                                    <h3 className='font-medium w-full h-5/6 flex items-center p-8'>pago mensual: 
                                        <p className='p-4 text-custom-blue font-bold'>${formatNumber(resultSimulator)}</p>
                                    </h3>
                                    <p className='bg'>*este monto no contiene añadido los seguros del prestamo*</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}