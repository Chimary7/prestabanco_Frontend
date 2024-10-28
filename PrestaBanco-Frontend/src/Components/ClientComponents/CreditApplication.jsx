import { useEffect, useState } from "react";
import loanService from "../../Services/loan.service";
import creditService from "../../Services/credit.service";
import pdfFileService from "../../Services/pdfFile.service";


export default function CreditApplication() {
    const [LoanType, setLoanType] = useState([]);
    const [credit, setCredit] = useState({
        rutClient: null,
        idLoanType: null,
        amount: null
    });
    const [pdfFiles, setPdfFiles] = useState([]);
    const [requiredDocuments, setRequiredDocuments] = useState([]);

    useEffect(() => {
        loanService.getAll()
        .then((response) => {
            setLoanType(response.data);
            console.log(response.data);
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


        const selectedLoan = LoanType.find(loanType => loanType.id == loanTypeId);
        if(selectedLoan && selectedLoan.requirements){
            setRequiredDocuments(selectedLoan.requirements);
        } else {
            setRequiredDocuments([]);
        }
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
            amountTotal: newAmount
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

                const fileResponse = await pdfFileService.create(fileData);
                console.log(fileResponse);
            }
        } catch (error) {
            console.error('error al solicitar credito', error);
        }
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
                                    <div className="w-full h-full">
                                        <div className="w-full h-1/3">
                                            <input type="text" 
                                                name="rutClient"
                                                value={credit.rutClient || ''}
                                                onChange={handleChange}
                                                placeholder="RUT"
                                                className="w-full p-3 bg-white rounded-md border text-black border-custom-blue"
                                                maxLength={12}/>
                                        </div>
                                        <div className="w-full h-1/3">
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
                                    </div>
                                )}
                        </div>
                        <div className='flex justify-center w-full mt-6'>
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
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}