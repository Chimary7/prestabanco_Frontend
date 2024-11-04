import { useEffect, useState } from "react";
import loanService from "../../Services/loan.service";
import creditService from "../../Services/credit.service";
import pdfFileService from "../../Services/pdfFile.service";


export default function CreditApplication() {
    const [LoanType, setLoanType] = useState([]);
    const [years, setYears] = useState(null);
    const [annualInterestRate, setAnnualInterestRate] = useState(null);
    const [credit, setCredit] = useState({
        rutClient: null,
        idLoanType: null,
        amount: null
    });
    const [pdfFiles, setPdfFiles] = useState([]);
    const [requiredDocuments, setRequiredDocuments] = useState([]);
    const [savingHistoryFile, setSavingHistoryFile] = useState(null);
    const [maxLoanTime, setMaxLoanTime] = useState(5);
    const [minInterest, setMinInterest] = useState(null);
    const [maxInterest, setMaxInterest] = useState(null);
    const [maxPorcentFinancy, setMaxPorcentFinancy] = useState(null);

    useEffect(() => {
        loanService.getAll()
        .then((response) => {
            setLoanType(response.data);
        })
        .catch((error) => {
            console.log(error);
        });
    }, []);


    const formatRUT = (rut) => {
        let cleanRUT = rut.replace(/[^0-9kK]/g, '').toUpperCase();
        let formattedRUT = '';
        if(cleanRUT.length > 1){
            const bodyRUT = cleanRUT.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            const checkDigit = cleanRUT.slice(-1);
            formattedRUT = `${bodyRUT}-${checkDigit}`;
        } else{
            formattedRUT = cleanRUT;
        }
        return formattedRUT;
    };

    const formatNumber = (number) => {
        // Parseamos el número y luego lo formateamos para que el usuario vea los puntos
        return new Intl.NumberFormat('es-ES', {
            style: 'decimal',
        }).format(number);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if(name === 'rutClient'){
            setCredit({
                ...credit,
                [name]: formatRUT(value)
            });
        } else if(name === 'amount'){
            const unformattedAmount = value.replace(/\./g, '');
            if(!isNaN(unformattedAmount)){
                setCredit({
                    ...credit,
                    [name]: formatNumber(unformattedAmount)
                });
            }
        } 
        else {
            setCredit({
                ...credit,
                [name]: value
            });
        }
        console.log(credit);
    };   

    const handleLoanTypeChange = (e) => {
        const loanTypeId = e.target.value;
        setCredit({ ...credit, idLoanType: loanTypeId });
    
        // Check if loanTypeId is defined and if LoanType array is populated
        if (loanTypeId && LoanType.length > 0) {
            const selectedLoan = LoanType.find(loanType => loanType.id == loanTypeId);
            if (selectedLoan) {
                console.log(selectedLoan);
                setMaxLoanTime(selectedLoan.maxTime);
                setMinInterest(selectedLoan.minInterest);
                setMaxInterest(selectedLoan.maxInterest);
                setMaxPorcentFinancy(selectedLoan.maxFinanPorcent);
                setAnnualInterestRate(selectedLoan.minInterest);
                setRequiredDocuments(selectedLoan.requirements);
            } else {
                // Reset values if no matching loan type is found
                setMaxLoanTime(null);
                setMinInterest(null);
                setMaxInterest(null);
                setRequiredDocuments([]);
            }
        }
    };
    
    const handleFileChangesavingHistory = (file) => {
        setSavingHistoryFile(file);
    };

    const handleFileChange = (index, file) => {
        if (pdfFiles.some((pdf) => pdf && pdf.name === file.name)) {
            alert("El archivo ya fue agregado. Seleccione otro archivo.");
            return;
        }

        const updatedFiles = [...pdfFiles];
        updatedFiles[index] = file;
        setPdfFiles(updatedFiles);
        console.log(pdfFiles);
    };

    const creditandFilesSubmit = async (e) => {
        e.preventDefault();
        const newAmount = credit.amount.replace(/\./g, '');
        const newCredit = {
            rutClient: credit.rutClient,
            idloanType: credit.idLoanType,
            amountTotal: newAmount,
            porcentInterest: annualInterestRate,
            maxPorcentFinancy: maxPorcentFinancy,
            timePay: years
        };

        console.log('archivos: ', pdfFiles);
        
        try {
            const response = await creditService.create(newCredit);
            const creditId = response.data.id;

            for (let i = 0; i < pdfFiles.length; i++) {
                const fileData = new FormData();
                fileData.append('category', requiredDocuments[i]);
                fileData.append('idCredit', creditId);
                fileData.append('data', pdfFiles[i]);

                await pdfFileService.create(fileData);
            }
            
            const savingHistoryData = {
                category: 'historial cuenta de ahorro',
                idCredit: creditId,
                data: savingHistoryFile
            }
            await pdfFileService.create(savingHistoryData);
            console.log(response.data);
        } catch (error) {
            console.error('error al solicitar credito', error);
        }
    };

    const handleYearsChange = (e) => {
        setYears(e.target.value);
    };

    const handleInterestChange = (e) => {
        const value = parseFloat(e.target.value);
        if(value >= minInterest && value <= maxInterest){
            setAnnualInterestRate(value);
        }
    };

    const YearOptions = () => {
        if (maxLoanTime) {
            const options = [];
            for (let i = 5; i <= maxLoanTime; i++) {
                options.push(<option key={i} value={i}>{i} años</option>);
            }
            return options;
        }
        return null;
    };

    return(
        <div className="w-full h-full">
            <form className="h-full w-full flex flex-col items-center p-2" onSubmit={creditandFilesSubmit}>
                <div className="flex w-full h-full">
                    <div className="w-1/2 h-full p-4">
                        <h1 className="w-full h-1/6 font-bold text-custom-blue">Solicitud de credito</h1>
                            <div className="w-full h-1/6 p-2">
                                <label htmlFor='loanType' className='text-custom-blue-light font-bold'>Tipo de credito</label>
                                    <select 
                                        name='loanType' 
                                        id='loanType' 
                                        onChange={handleLoanTypeChange}
                                        className='w-full p-3 bg-white rounded-md border text-black border-custom-blue'>
                                        <option value="">Selecciona un tipo de crédito</option>
                                        {LoanType.map(loanType => (
                                            <option key={loanType.id} value={loanType.id}>{loanType.nameLoan}</option>
                                        ))}
                                    </select>
                            </div>
                            <div className="w-full h-3/6 p-2">
                                {credit.idLoanType && (
                                    <div className="w-full h-full flex flex-col space-y-3">
                                        <div className="w-full h-1/6">
                                            <input 
                                                type="text" 
                                                name="rutClient"
                                                value={credit.rutClient || ''}
                                                onChange={handleChange}
                                                placeholder="RUT"
                                                className="w-full p-3 bg-white rounded-md border text-black border-custom-blue"
                                                maxLength={12}/>
                                        </div>
                                        <div className="w-full h-1/5">
                                            <label htmlFor='amount' className='text-custom-blue-light font-bold'>Monto total de la propiedad o remodelación</label>
                                                <input 
                                                    type="text"
                                                    name='amount'
                                                    id='amount'
                                                    value={credit.amount || ''}
                                                    onChange={handleChange}
                                                    className='w-full p-3 bg-white rounded-md border text-black border-custom-blue'     
                                                />
                                        </div>
                                        <div className="w-full h-1/5">
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
                                        <div className="w-full h-1/5">
                                            <label htmlFor="annualInterestRate" className="text-custom-blue-light font-bold">Tasa de interés (minima: {minInterest}% , maxima: {maxInterest}% )</label>
                                                <input 
                                                    type="number" 
                                                    name="annualInterestRate" 
                                                    value={annualInterestRate} 
                                                    onChange={handleInterestChange} 
                                                    min={minInterest} 
                                                    max={maxInterest} 
                                                    step="0.01" 
                                                    className="w-full p-3 bg-white rounded-md border text-black border-custom-blue"
                                                />
                                        </div>
                                        <div className="w-full h-1/5">
                                            <label htmlFor="porcentFinancy"className="text-custom-blue-light font-bold">porcentaje de finaciamiento (maxima: {maxPorcentFinancy}%)</label>
                                            <input 
                                                type="text" 
                                                id="porcentFinancy"
                                                name="porcentFinancy"
                                                value={maxPorcentFinancy}
                                                className="w-full p-3 bg-white rounded-md border text-black border-custom-blue"
                                                min={50}
                                            />
                                        </div>
                                    </div>
                                )}
                        </div>
                        <div className='flex justify-center w-full mt-10'>
                            <button className="mt-4 h-4/6 w-1/2 bg-blue-700 text-white rounded" type='submit'>Enviar</button>
                        </div>
                    </div>
                    <div className="w-1/2 h-full border-dotted border-l border-gray-200">
                        <h2 className="h-1/6 flex items-center justify-center font-semibold text-custom-blue-light border-b border-custom-blue-light">Documentos Requeridos PDF</h2>
                        <div className="w-full h-full">
                            {requiredDocuments.map((doc, index) => (
                                <div key={index} className="mt-4 p-2">
                                    <label className="text-custom-blue-light font-medium">{doc}</label>
                                    <input 
                                        type="file"
                                        accept="application/pdf"
                                        onChange={(e) => handleFileChange(index, e.target.files[0])}
                                        className="w-full p-2 mt-1 border border-gray-300 rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-custom-blue-light file:text-white hover:file:bg-custom-blue"
                                        required
                                    />
                                </div>
                            ))}
                            {requiredDocuments.length > 0 && (
                                <div className="mt-4 p-2">
                                    <label className="text-custom-blue-light font-medium">Historial cuenta de ahorro</label>
                                    <input 
                                        type="file"
                                        accept="application/pdf"
                                        onChange={(e) => handleFileChangesavingHistory(e.target.files[0])}
                                        className="w-full p-2 mt-1 border border-gray-300 rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-custom-blue-light file:text-white hover:file:bg-custom-blue"
                                        required
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}