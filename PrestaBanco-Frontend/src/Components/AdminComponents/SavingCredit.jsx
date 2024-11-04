import { useState, useEffect } from "react";
import calculateService from "../../Services/calculate.service"
import userService from "../../Services/user.service";
import pdfFileService from "../../Services/pdfFile.service";
import creditService from "../../Services/credit.service";
import { useNavigate } from "react-router-dom";

export default function SavingCredit() {
    const navigate = useNavigate();
    const [creditDetail, setCreditDetail] = useState('');
    const [MonthPayCredit, setMonthPayCredit] = useState('');
    const [MonthSaving, setMonthSaving] = useState('');
    const [isChecked, setIsChecked] = useState({
        depfrecuency: false,
        savingHistory: false,
        retiratePayment: false
    });
    const [Years, setYears] = useState('');
    const [BooleanMinPayment, setBooleanMinPayment] = useState(false);
    const [BooleanMinPaymentIngresoYear, setBooleanMinPaymentIngresoYear] = useState(false);
    const [savingEvaluation, setSavingEvaluation] = useState(false);

    useEffect(() => {
        // Retrieve credit data from localStorage
        const storedCredit = JSON.parse(localStorage.getItem('Credit'))?.data;
        console.log("Stored Credit:", storedCredit); // Check what's stored
        if (storedCredit) {
            if (storedCredit.savingHistory) {
                navigate('/admin/home/solicitud/desembolso');
            } else {
                setCreditDetail(storedCredit);
                const calculate_prestamo = (storedCredit.amountTotal * (storedCredit.maxPorcentFinancy / 100));
                setMonthPayCredit(calculate_prestamo);
                console.log("Monto a pagar mensualmente:", calculate_prestamo);
            }
        } else {
            console.log("No hay datos de crédito en localStorage.");
            navigate('/admin/home/solicitudes');
        }
    }, []);

    useEffect(() => {
        const trueConditions = [
            BooleanMinPayment,
            BooleanMinPaymentIngresoYear,
            isChecked.depfrecuency,
            isChecked.savingHistory,
            isChecked.retiratePayment,
        ].filter(Boolean).length;

        if (trueConditions >= 5) {
            setSavingEvaluation('SOLIDA');
        } else if (trueConditions >= 3) {
            setSavingEvaluation('MODERADA');
        } else {
            setSavingEvaluation('INSUFICIENTE');
        }
    }, [BooleanMinPayment, BooleanMinPaymentIngresoYear, isChecked]);

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setIsChecked((prevState) => ({
            ...prevState,
            [name]: checked, // Set the checkbox's value directly to true or false
        }));
    };

    const handleSavingCreditReject = () => {
        const updatedCredit = {
            ...creditDetail,
            processCredit: false,
            creditStatus: 'RECHAZADA',
            savingHistory: savingEvaluation
        };
        creditService.update(updatedCredit)
            .then(() => {
                navigate('/admin/home/solicitudes');
            })
            .catch((error) => {
                console.log("Se ha producido un error al intentar evaluar la solicitud de crédito", error);
            });
    }

    const handleSavingCreditAccept = () => {
        const updatedCredit = {
            ...creditDetail,
            processCredit: false,
            creditStatus: 'APROBADA',
            savingStatus: savingEvaluation,
            savingHistory: true
        };
        creditService.update(updatedCredit)
            .then(() => {
                navigate('/admin/home/solicitudes');
            })
            .catch((error) => {
                console.log("Se ha producido un error al intentar evaluar la solicitud de crédito", error);
            });
    }

    const handleCalculateMinSaving = async (e) => {
        e.preventDefault();
        try{
            const response = await calculateService.getminSaving(MonthSaving, MonthPayCredit);
            setBooleanMinPayment(response.data);
        } catch (error) {
            console.error("Error al calcular el saldo minimo requerido:", error);
        }
    };

    const handleCalculateRelationPayYears = async (e) => {
        e.preventDefault();
        try{
            const response = await calculateService.getRelationPayYears(MonthSaving, MonthPayCredit, Years);
            setBooleanMinPaymentIngresoYear(response.data);
        } catch (error) {
            console.error("Error al calcular el saldo minimo requerido:", error);
        }
    };


    const downloadFile = async (category, idCredit, fileName) => {
        try {
            const response = await pdfFileService.getPdfCategoryByCreditId(category, idCredit);
            const blob = new Blob([response.data], { type: 'application/pdf' }); // Blob with the correct type
    
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName); // Suggested filename
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error downloading the file:", error);
        }
    };

    const handlePendingDocumentation = () => {
        const updatedCredit = {
            ...creditDetail,
            creditStatus: 'PENDIENTE_DE_DOCUMENTACIÓN',
            savingStatus: savingEvaluation
        }
        creditService.update(updatedCredit)
        .then(() => navigate('/admin/home/solicitudes'))
        .catch((error) => console.error("Error al actualizar a documentación pendiente:", error));
    };

    return(
        <div className="w-full h-full flex flex-col items-center p-4 space-y-4 bg-gray-200 text-black">
            <h1 className="text-2xl font-bold text-gray-700">
                Capacidad de ahorro
            </h1>
            <div className="bg-white shadow-md rounded-lg w-full h-5/6 flex p-4 space-x-4">
                <div className="w-1/2 h-full space-y-4">
                    <div className="w-full h-1/3 flex flex-col items-center justify-center">
                        <h2 className="font-semibold text-gray-600 p-4">Saldo minimo requerido</h2>
                            <div className="w-full h-1/5 p-2">
                                <button
                                    onClick={() => downloadFile('Comprobante de ingresos', creditDetail.id, 'Cuenta_ahorro.pdf')}
                                    className="text-white underline-none text-sm mt-1 bg-black"
                                >
                                    Descargar archivo antigüedad laboral
                                </button>
                            </div>
                            <form onSubmit={handleCalculateMinSaving} className="h-4/5 w-full p-2">
                                <input 
                                        type="number" 
                                        value={MonthSaving}
                                        onChange={(e) => setMonthSaving(e.target.value)}
                                        placeholder="Ingrese monto de la cuenta de ahorro"
                                        className="p-2 border border-custom-blue-light bg-white rounded-md m-2 text-black"
                                    />
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg" 
                                >
                                    evaluar saldo minimo requerido
                                </button>
                                {BooleanMinPayment ? (
                                    <div className="bg-green-200 rounded-md p-4 border border-green-400">
                                        <p className="text-sm text-green-600 font-bold"> cumple con el monto minimo de ahorro</p>
                                    </div>
                                ) : ( <div className="bg-red-200 rounded-md p-4 border border-red-400">
                                    <p className="text-sm text-red-600 font-bold">no cumple con el monto minimo de ahorro</p>
                                </div>
                                )}
                            </form>
                    </div>
                    <div className="w-full h-1/4 flex flex-col items-center justify-center">
                        <h2 className="font-semibold text-gray-600 p-4"> Depositos periodicos</h2>
                        <label>
                            <input 
                                type="checkbox" 
                                name="depfrecuency"
                                checked={isChecked.depfrecuency}
                                onChange={handleCheckboxChange}
                                className="mr-1 bg-white"/>
                                realiza depositos periodicos de minimo 5% (mensual o trimestral)
                        </label>
                    </div>
                    <div className="w-full h-1/3 flex flex-col items-center justify-center">
                        <h2 className="font-semibold text-gray-600 p-4"> Relacion saldo / años de antiguedad</h2>
                        <form onSubmit={handleCalculateRelationPayYears} className="h-4/5 w-full">
                                <input 
                                        type="number" 
                                        value={Years}
                                        onChange={(e) => setYears(e.target.value)}
                                        placeholder="Ingrese años de antiguedad"
                                        className="p-2 border border-custom-blue-light bg-white rounded-md m-2 text-black"
                                    />
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg" 
                                >
                                    evaluar saldo minimo requerido
                                </button>
                                {BooleanMinPaymentIngresoYear ? (
                                    <div className="bg-green-200 rounded-md p-4 border border-green-400">
                                        <p className="text-sm text-green-600 font-bold">cumple con la relacion saldo / años de antiguedad</p>
                                    </div>
                                ) : ( <div className="bg-red-200 rounded-md p-4 border border-red-400">
                                    <p className="text-sm text-red-600 font-bold">no cumple con la relacion saldo / años antiguedad</p>
                                </div>
                                )}
                            </form>
                    </div>
                </div>
                <div className="w-1/2 h-full space-y-4">
                    <div className="w-full h-1/4 flex flex-col items-center justify-center">
                        <h2 className="font-semibold text-gray-600 p-4"> Historial de ahorro consistente</h2>
                        <label>
                            <input 
                                type="checkbox" 
                                name="savingHistory"
                                checked={isChecked.savingHistory}
                                onChange={handleCheckboxChange}
                                className="mr-1 bg-white"/>
                                saldo de cuenta positivo y no supera ningun retiro el 50% del saldo en los ultimo 12 meses
                        </label>
                    </div>
                    <div className="w-full h-1/4 flex flex-col items-center justify-center">
                        <h2 className="font-semibold text-gray-600 p-4"> Retiros de cuenta</h2>
                        <label>
                            <input 
                                type="checkbox" 
                                name="retiratePayment"
                                checked={isChecked.retiratePayment}
                                onChange={handleCheckboxChange}
                                className="mr-1 bg-white"/>
                                no ha realizado un retiro superior al 30% del saldo de su cuenta
                                en los últimos 6 meses
                        </label>
                    </div>
                    <div className="w-full h-1/4 flex flex-col items-center justify-center">
                        <div className={`p-4 rounded-md ${
                            savingEvaluation === 'SOLIDA' ? 'bg-green-200 border-green-400' : 
                            savingEvaluation === 'MODERADA' ? 'bg-yellow-200 border-yellow-400' : 
                            'bg-red-200 border-red-400'
                        }`}>
                            <p className={`text-sm font-bold ${
                                savingEvaluation === 'SOLIDA' ? 'text-green-600' : 
                                savingEvaluation === 'MODERADA' ? 'text-yellow-600' : 
                                'text-red-600'
                            }`}>
                                Ahorro: {savingEvaluation}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex space-x-4 w-full justify-between items-center bg-white p-4 rounded-md shadow-md">
                <button 
                    onClick={handleSavingCreditReject}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg w-1/4"
                >
                    Rechazar
                </button>
                <button
                    onClick={handlePendingDocumentation}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg w-1/4"
                    >
                    Documentación Pendiente
                </button>
                {savingEvaluation !== 'INSUFICIENTE' && (
                    <>
                        <button
                            onClick={handleSavingCreditAccept}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg w-1/4"
                        >
                            Aprobar Capacidad de ahorro
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}